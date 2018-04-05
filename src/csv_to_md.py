
import os
import csv
import yaml
from copy import deepcopy
import json

# Конфигурация
services_file = 'csv/services.csv'

services_build_dir = '_posts'

keywords_file = 'csv/keywords.csv'
add_info_for_service = ({
    'title': 'offers',
    'file_name': 'csv/offers.csv'
},{
    'title': 'guarantee',
    'file_name': 'csv/guarantee.csv'
})


# Названия параметров в CSV файле
name_id = "id"
name_layout = "layout"
name_folder = "folder"
name_alias  = "alias"
name_content  = "content"
name_breadcrumbs = "breadcrumbs"
name_seo_title = "seo_title"
name_seo_h1 = "seo_h1"
name_seo_desc = "seo_description"

exclude_params_names = [name_content, name_breadcrumbs, name_seo_title, name_seo_h1, name_seo_desc]

# Открытие файла со списком услуг
with open(services_file, 'r') as f:
    reader = csv.reader(f, dialect='excel', delimiter=';')
    # Преобразование CSV в список
    services_list = tuple(reader)

# Открытие файла со списком услуг
with open(keywords_file, 'r') as f:
    reader = csv.reader(f, dialect='excel', delimiter=';')
    # Преобразование CSV в список
    keywords_list = tuple(reader)

add_info_list = {}
from itertools import groupby
for add_info in add_info_for_service:
    with open(add_info['file_name'], 'r') as f:
        reader = csv.reader(f, dialect='excel', delimiter=';')
        reader = tuple(reader)
        # Преобразование CSV в список
        add_info_list[add_info['title']] = {}
        add_info_list[add_info['title']]['title'] = add_info['title']
        
        add_info_list[add_info['title']]['headers'] = reader[0]
        add_info_list[add_info['title']]['elements'] = reader[1:]
        add_info_list[add_info['title']]['ids'] = [el for el, _ in groupby([id_elem[0] for id_elem in add_info_list[add_info['title']]['elements']])]


# Количество услуг
count_services = len(services_list)

# Список названий параметров для MD файла
services_params_titles = services_list[0]

# Количество параметров
count_services_params = len(services_params_titles)

# Индекс элемента со значениями
index_id = services_params_titles.index(name_id)
index_layout = services_params_titles.index(name_layout)
index_folder = services_params_titles.index(name_folder)
index_alias = services_params_titles.index(name_alias)
index_content = services_params_titles.index(name_content)
index_breadcrumbs = services_params_titles.index(name_breadcrumbs)

index_seo_title = services_params_titles.index(name_seo_title)
index_seo_h1 = services_params_titles.index(name_seo_h1)
index_seo_desc = services_params_titles.index(name_seo_desc)

def create_dir(dir):
    '''
    Создание папки и вход в нее
    '''
    try:
        os.mkdir(dir)
        os.chdir(dir)
    except(FileExistsError):
        # print('Каталог уже существует - ' + dir)
        os.chdir(dir)

def create_service_dir(folders, index_folder = index_folder):
    '''
    Cоздание папки для конкретной услуги
    '''
    folders_array = folders.split('/')
    for folder in range(0, len(folders_array)):
        create_dir(folders_array[folder])
        
def save_file_md(file_name, front_matter, content):
    '''
    Создание файла md
    '''
    front_matter_yaml = yaml.dump(front_matter, encoding='utf-8', allow_unicode=True, default_flow_style=False)
    front_matter_yaml = front_matter_yaml.decode("utf-8", "ignore")

    file = open(file_name,'w',encoding='utf-8')
    file.write('---\n')
    file.write(front_matter_yaml)
    file.write('---\n')
    file.write(content)
    file.close



# Создание корневой папки
os.chdir('..')
create_dir('source')
create_dir(services_build_dir)

# print(services_list)
# Формирование списка услуг в нужном формате
'''
Каждая услуга в списке это словарь:
{
    id: id услуги
    file_name: имя файла
    folder: папка назначения
    content: Контент md файла, тот который идет после Front Mattern
    front_matter: словарь всех свойств для добавления во Front Mattern
}

'''
service_data = []
for i in range(1, count_services):
    j = i - 1
    service = services_list[i]

    # Добавление услуги в список service_data
    service_data.append(j)
    service_data[j] = {}
    service_data[j]['id'] = services_list[i][index_id]
    service_data[j]['file_name'] = services_list[i][index_alias] + '.md'
    service_data[j]['folder'] = services_list[i][index_folder]
    service_data[j]['content'] = services_list[i][index_content]
    service_data[j]['front_matter'] = {}

    # # Наполение секции seo словаря front_mattern
    service_data[j]['front_matter']['seo'] = {}
    service_data[j]['front_matter']['seo']['title'] = service[index_seo_title]
    service_data[j]['front_matter']['seo']['h1'] = service[index_seo_h1]
    service_data[j]['front_matter']['seo']['description'] = service[index_seo_desc]
    service_data[j]['front_matter']['seo']['keywords'] = []
    for keyword in keywords_list:
        if keyword[0] == service_data[j]['id']:
             service_data[j]['front_matter']['seo']['keywords'] += [keyword[2]]

    service_data[j]['front_matter']['breadcrumbs'] = json.loads(service[index_breadcrumbs])
    # Наполение словаря front_mattern параметрами из CSV файлов
    for k in range(0,count_services_params):
        if (str(services_params_titles[k]) not in exclude_params_names):
            try:
                service_data[j]['front_matter'][str(services_params_titles[k])] = int(services_list[i][k])
            except:
                service_data[j]['front_matter'][str(services_params_titles[k])] = services_list[i][k]
            

    for add_info in add_info_list:
        
        if service_data[j]['id'] in add_info_list[add_info]['ids']:
            add_info_title = str(add_info_list[add_info]['title'])
            service_data[j]['front_matter'][add_info_title] = []
            for element in add_info_list[add_info]['elements']:
                if element[0] == service_data[j]['id']:

                    vals = {}
                    for sub_element in element[2:]:
                        sub_element_name = add_info_list[add_info]["headers"][element.index(sub_element)]
                        try:
                            vals[sub_element_name] = int(sub_element)
                        except:
                            vals[sub_element_name] = sub_element
                    service_data[j]['front_matter'][add_info_title] += [vals]

# print(add_info_list)

# print(service_data)

for service in service_data:
    create_service_dir(service['folder'], index_folder)
    save_file_md(service['file_name'], service['front_matter'], service['content'])
    for j in range(0, len(service['folder'].split('/'))):
        os.chdir('..')

# {
#     'title': 'offers', \
#     'headers': ('service_ID', 'service_name', 'name', 'type', 'price')
#     'elements': [
#         ['1', 'Диагностика неисправностей ноутбука', 'Программная диагностика', 'eq', '500'], 
#         ['1', 'Диагностика неисправностей ноутбука', 'Аппаратная диагностика', 'eq', '1200']
#     ]
# }