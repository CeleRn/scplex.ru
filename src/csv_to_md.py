
import os
import csv

# Конфигурация
services_file = 'csv/services.csv'
services_build_dir = '_posts'

# Названия параметров в CSV файле
name_layout = "layout"
name_folder = "folder"
name_alias  = "alias"
name_seo_title = "seo_title"
name_seo_h1 = "seo_h1"
name_seo_desc = "seo_description"

# Открытие файла со списком услуг
with open(services_file, 'r') as f:
    reader = csv.reader(f, dialect='excel', delimiter=';')
    # Преобразование CSV в список
    services_list = list(reader)

# Количество услуг
count_services = len(services_list)
# Список названий параметров для MD файла
services_params_titles = services_list[0]
# Количество параметров
count_services_params = len(services_params_titles)
# Индекс элемента со значениями
index_layout = services_params_titles.index(name_layout)
index_folder = services_params_titles.index(name_folder)
index_alias = services_params_titles.index(name_alias)
# index_seo_title = services_params_titles.index(name_seo_title)
# index_seo_h1 = services_params_titles.index(name_seo_h1)
# index_seo_desc = services_params_titles.index(name_seo_desc)

# Создание папки и вход в нее
def create_dir(dir):
    try:
        os.mkdir(dir)
        os.chdir(dir)
    except(FileExistsError):
        print('Каталог уже существует - ' + dir)
        os.chdir(dir)

# создание папки для конкретной услуги
def create_service_dir(service_params, index_folder = index_folder):
    str_folder = service_params[index_folder]
    folders = str_folder.split('/')
    print(folders)
    for folder in range(0, len(folders)):
        create_dir(folders[folder])
        

# Создание корневой папки
os.chdir('..')
create_dir('source')
create_dir(services_build_dir)

# Создание файлов услуг
for i in range(1, count_services):
    # Список значений параметров данного файла
    service_params = services_list[i]
    # Создание папки для услуги
    create_service_dir(service_params, index_folder)
    # Alias
    alias = service_params[index_alias]
    file = open(alias + '.md','w',encoding='utf-8')
    file.write('---\n')
    for j in range(0,count_services_params - 1):
    #     print(str(services_params_titles[j]) + ': ' + str(service_params[j]))
        file.write(str(services_params_titles[j]) + ': ' + service_params[j] + '\n')
    file.write('---\n')
    file.close
    
    # возврат в services_build_dir
    for j in range(0, len(service_params[index_folder].split('/'))):
        os.chdir('..')





