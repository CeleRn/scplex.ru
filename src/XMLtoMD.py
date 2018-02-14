from html.parser import HTMLParser
import xml.etree.cElementTree as ET
from xml.etree import ElementTree
import requests
import os
from transliterate import translit, get_available_language_codes

tree = ET.parse('products.xml')
root = tree.getroot()

root_dir = 'source'
goods_dir = '_posts'
images_dir = 'images'
slash = '\\'
slashPath = '/'
admitad_prefix = 'https://ad.admitad.com/g/c57ea7e5e8b410cbc789cdc819b1e0/?i=5&ulp='
try:
    os.mkdir(root_dir)
    os.chdir(root_dir)
except(FileExistsError):
    print('Каталог уже существует - ' + root_dir)
    os.chdir(root_dir)

# categories = root.iter('categories')
for categories in root.iter('categories'):
    categories = categories

def translit_string(string):
    tr_string = translit(string, 'ru', reversed=True).replace(".","").replace("*","").replace(",","").replace(" ","_").replace("'","").replace("\\","").replace("/","").replace("\"","").lower()
    return tr_string

def get_childs(element_id):
    list_of_childs = []
    for category in categories.iter('category'):
        if category.attrib.get('parentId') == element_id:
            dir_name = translit_string(category.text)
            list_of_childs = list_of_childs + [[category.attrib.get('id'), dir_name, category.text, get_childs(category.attrib.get('id')), category.attrib.get('parentId')]]
    return list_of_childs

current_level_id_list = []
for category in categories.iter('category'):   
    if not category.attrib.get('parentId'):
        dir_name = translit_string(category.text)
        current_level_id_list = current_level_id_list + [[category.attrib.get('id'), dir_name, category.text,get_childs(category.attrib.get('id')), category.attrib.get('parentId')]]



def mk_way(category_obj):
    dir_way = translit_string(category_obj.text) + slashPath
    # print(dir_way)
    if category_obj.attrib.get('parentId'):
        for parent in categories.iter('category'):
            if parent.attrib.get('id') == category_obj.attrib.get('parentId'):
                dir_way = mk_way(parent) + dir_way
    return dir_way

def category_name_from_id(category_obj):
    return [(category_obj.attrib.get('id'),category_obj.text)]

def mk_breadcrumb_path(category_obj):
    breadcrumb = category_obj.attrib.get('id') + ","
    if category_obj.attrib.get('parentId'):
        for parent in categories.iter('category'):
            if parent.attrib.get('id') == category_obj.attrib.get('parentId'):
                breadcrumb = breadcrumb + mk_breadcrumb_path(parent)
    return (breadcrumb)
    
def mk_breadcrumb(category_obj):
    category_list = (mk_breadcrumb_path(category_obj).split(",")[:-1])
    category_list = list(reversed(category_list))
    return [(category_id, tuple(category_list))]


def mk_breadrumb_array(current_category_id, categoryBreadcrumb, category_id_name, category_id_way):
    array_ids = categoryBreadcrumb.get(current_category_id)
    breadcrumb_array = ()
    for category_id in array_ids:
        category_name = category_id_name.get(category_id)
        categoty_path = category_id_way.get(category_id)
        breadcrumb_array = breadcrumb_array + ((category_name, categoty_path),)
    return breadcrumb_array

def write_image(image_url, file_name, images_dir = images_dir, goods_dir = goods_dir):
    r = requests.get(image_url, stream=True)
    os.chdir('..')
    try:
        os.mkdir(images_dir)
        os.chdir(images_dir)

    except(FileExistsError):
        print('Каталог уже существует - ' + images_dir)
        os.chdir(images_dir)
    if r.status_code == 200:
        with open(file_name+".jpg", 'wb') as f:
            for chunk in r:
                f.write(chunk)
    os.chdir('../' + goods_dir)

def admitad_link_to_page_url(admitad_link, admitad_prefix):
    page_url = admitad_link.replace(admitad_prefix, '').replace('%3A',':').replace('%2F','/')
    return page_url

def page_content_from_admitad_link(admitad_link, admitad_prefix):
    page_url = admitad_link_to_page_url(admitad_link, admitad_prefix)
    page = requests.get(page_url, stream=False)
    if page.status_code == 200:
        page_content = str(page.content,'utf-8')
    return page_content


class voltoffHTMLParser(HTMLParser):
    images_array = []
    small_images = ()
    big_images = ()
    def handle_starttag(self, tag, attrs):
        # self.big_image_array = ()
        for attr in attrs:
            if ((attr[0] == 'class') and (attr[1] == 'kt_itemPhoto')):
                # print('Есть картинка')
                attrs_dist = dict(attrs)
                # print('Маленькая картинка: ' + attrs_dist.get('data-med-photo'))
                self.small_images = self.small_images + ((attrs_dist.get('data-med-photo')),)
                # print('Большая картинка: ' + attrs_dist.get('data-max-photo'))
                self.big_images = self.big_images + ((attrs_dist.get('data-max-photo')),)

category_id_way = []
category_id_name = []
categoryBreadcrumb = []
for category in categories.iter('category'):
    path = slashPath + mk_way(category)
    category_id = category.attrib.get('id')
    category_id_way = category_id_way + [(category_id,path)]
    category_id_name = category_id_name + category_name_from_id(category)
    categoryBreadcrumb = categoryBreadcrumb + mk_breadcrumb(category)
    
    
category_id_way = dict(category_id_way) # Словарь (ID категории : Путь к категории) 
category_id_name = dict(category_id_name) # Словарь (ID категории : Путь к категории) 
categoryBreadcrumb = dict(categoryBreadcrumb) # Словарь (ID категории : цепочка ID категорий хлебных крошек)


def mk_breadcrumb_string(current_category_id, categoryBreadcrumb, category_id_name, category_id_way):
    breadrumb_array = mk_breadrumb_array(current_category_id, categoryBreadcrumb, category_id_name, category_id_way)
    breadcrumb_string = 'breadcrumbs:\n'
    for breadrumb_item in breadrumb_array:
        breadcrumb_string = breadcrumb_string + '  - name: ' + breadrumb_item[0] + '\n    url: ' + breadrumb_item[1] + '\n'
    return breadcrumb_string
    # breadcrumbs:\n
#   - name: О гитарах\n    url: /about-guitars/\n
#   - name: Виды гитар\n    url: /about-guitars/types-of-guitars/\n

def create_index_file(params):
    file = open("index.md",'w',encoding='utf-8')
    file.write('---\n')
    file.write('layout: section\n')
    file.write('id: ' + params[0]+ '\n')
    file.write('title: ' + params[1]+ '\n')
    file.write('parentId: ' + str(params[2])+ '\n')
    file.write(mk_breadcrumb_string(params[0], categoryBreadcrumb, category_id_name, category_id_way))
    file.write('breadcrumbCurrent: false\n')
    file.write('---\n')
    file.close

def mkDirsTree(dir_obj):
    dir_name = dir_obj[1]
    try:
        os.mkdir(dir_name)
        os.chdir(dir_name)

    except(FileExistsError):
        # print('Каталог уже существует - ' + dir_name)
        os.chdir(dir_name)
    params = [dir_obj[0],dir_obj[2],dir_obj[4]]
    create_index_file(params)
    childs = dir_obj[3]
    for child in childs:
        mkDirsTree(child)
    os.chdir('..')

for category in current_level_id_list:
    mkDirsTree(category)




def create_md_file(offer_obj, categoryBreadcrumb, category_id_name, category_id_way, admitad_prefix):
    offer = offer_obj
    if offer.find('vendor').text:
        if offer.find('model'):
            file_name = offer.find('vendor').text + "__" + offer.find('model').text
        else:
            file_name = offer.find('vendor').text + "__" + offer.find('vendorCode').text
    else:
        if not offer.find('model'):
            file_name = offer.find('vendorCode').text
        else:
            file_name = offer.find('model').text
    file_name = translit_string(file_name)
    file = open(file_name+".md",'w',encoding='utf-8')
    file.write('---\n')
    # file.write(': ' + offer.attrib)
    # file.write(': ' + offer.text)
    # file.write(': ' + offer.attrib)
    file.write('layout: good\n')
    file.write(mk_breadcrumb_string(offer.find('categoryId').text, categoryBreadcrumb, category_id_name, category_id_way))
    file.write('breadcrumbCurrent: true\n')
    file.write('categoryId: ' + offer.find('categoryId').text + '\n')
    file.write('section: ' + category_id_way.get(offer.find('categoryId').text) + '\n')
    file.write('country_of_origin: ' + offer.find('country_of_origin').text + '\n')
    file.write('delivery: ' + offer.find('delivery').text + '\n')
    file.write('description: \"' + offer.find('description').text.replace('"', '\"') + '\"\n')
    file.write('local_delivery_cost: ' + offer.find('local_delivery_cost').text + '\n')
    file.write('manufacturer_warranty: ' + offer.find('manufacturer_warranty').text + '\n')
    if offer.find('model') is not None:
        if offer.find('model').text:
            file.write('model: ' + offer.find('model').text + '\n')
        else:
            file.write('model: null' + '\n')
    else:
            file.write('model: null' + '\n')
    # file.write('model: ' + offer.find('model').text + '\n')
    file.write('modified_time: ' + offer.find('modified_time').text + '\n')
    file.write('name: ' + offer.find('name').text + '\n')
    # file.write('oldprice: ' + offer.find('oldprice').text + '\n')
    if offer.find('oldprice') is not None:
        if offer.find('oldprice').text:
            file.write('oldprice: ' + offer.find('oldprice').text + '\n')
        else:
            file.write('oldprice: null' + '\n')
    else:
            file.write('oldprice: null' + '\n')
    file.write('price: ' + offer.find('price').text + '\n')
    file.write('title: ' + offer.find('typePrefix').text + ' ' + offer.find('vendor').text + ' ' + offer.find('model').text + '\n')
    file.write('longtitle: ' + offer.find('typePrefix').text + ' ' + offer.find('vendor').text + ' ' + offer.find('model').text + ' купить за ' + offer.find('price').text + ' руб.' + '\n')
    file.write('vendor_and_model: ' + offer.find('vendor').text + ' ' + offer.find('model').text + '\n')
    file.write('banner: ' + '/' + images_dir + '/' + file_name + '.jpg\n')

    admitad_link = offer.find('url').text
    page_content = page_content_from_admitad_link(admitad_link, admitad_prefix)
    parser = voltoffHTMLParser()
    parser.feed(page_content)
    
    # print(parser.small_images)
    # breadcrumb_string = breadcrumb_string + '  - name: ' + breadrumb_item[0] + '\n    url: ' + breadrumb_item[1] + '\n'
    i = 1
    file.write('thumbnailImages:\n')
    for small_image in parser.small_images:
        img_name = 'thumbnail_' + str(i) + '__' + file_name
        full_img_name = '/images/' + img_name + '.jpg'
        write_image(small_image, img_name, images_dir = images_dir, goods_dir = goods_dir)
        file.write('  - ' + full_img_name + '\n')
        # print(small_image)
        i = i + 1

    i = 1
    file.write('bigImages:\n')
    for big_image in parser.big_images:
        img_name = str(i) + '__' + file_name
        full_img_name = '/images/' + img_name + '.jpg'
        write_image(big_image, img_name, images_dir = images_dir, goods_dir = goods_dir)
        file.write('  - ' + full_img_name + '\n')
        # print(small_image)
        i = i + 1


    # file.write('picture: ' + offer.find('picture').text + '\n')

    # write_image(offer.find('picture').text, file_name, images_dir = images_dir, goods_dir = goods_dir)
    
    if offer.find('typePrefix') is not None:
        if offer.find('typePrefix').text:
            file.write('typePrefix: ' + offer.find('typePrefix').text + '\n')
        else:
            file.write('typePrefix: null' + '\n')
    else:
        file.write('typePrefix: null' + '\n')

    file.write('buyUrl: ' + offer.find('url').text + '\n')
    # file.write('vendor: ' + offer.find('vendor').text + '\n')
    
    # if offer.find('vendor'):
    




    if offer.find('vendor') is not None:
        if offer.find('vendor').text:
            file.write('vendor: ' + offer.find('vendor').text + '\n')
        else:
            file.write('vendor: null' + '\n')
    
    file.write('vendorCode: ' + offer.find('vendorCode').text + '\n')
    file.write('---\n')
    file.close()


list_of_offers = []

try:
    os.mkdir(goods_dir)
    os.chdir(goods_dir)

except(FileExistsError):
    print('Каталог уже существует - ' + goods_dir)
    os.chdir(goods_dir)
count_of_errors = 0
i = 0
for offer in root.iter('offer'):
    # list_of_offers = list_of_offers + offer
    try:
        create_md_file(offer, categoryBreadcrumb, category_id_name, category_id_way, admitad_prefix)
    except Exception as error:
        print(offer.find('name').text)
        print(offer.find('categoryId').text)
        print(offer.find('url').text)
        print(category_id_way.get(offer.find('categoryId').text))
        print(str(error))
        count_of_errors += 1
        print(count_of_errors)
    i = i + 1
    if (i == 20):
        break
    
print('Епта.... ФИНИШ!!!')