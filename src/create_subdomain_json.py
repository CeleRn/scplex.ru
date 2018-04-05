import os
import csv
import json
import codecs

cities_file = 'csv/cities.csv'

alias_name = 'alias'
coordinates_name = 'coordinates'

exclude_params_names = [alias_name, coordinates_name]




# Открытие файла со списком городов (поддоменов)
with open(cities_file, 'r') as f:
    reader = csv.reader(f, dialect='excel', delimiter=';')
    # Преобразование CSV в список
    cities_list = tuple(reader)


# Количество городов
count_services = len(cities_list)

# Список названий параметров для JSON файла
cities_params_titles = cities_list[0]

# Количество параметров
count_services_params = len(cities_params_titles)

alias_id = cities_params_titles.index(alias_name)
coordinates_id = cities_params_titles.index(coordinates_name)


subdomains_data = {}

subdomains_data['master'] = {}

for subdomain in cities_list[1:]:
    # subdomains_data[subdomain[alias_id]] = {}
    vals = {}
    for sub_element in subdomain:

        if cities_params_titles[subdomain.index(sub_element)] not in exclude_params_names:
            sub_element_name = cities_params_titles[subdomain.index(sub_element)]
            try:
                vals[sub_element_name] = int(sub_element)
            except:
                vals[sub_element_name] = sub_element
        vals['coordinates'] = [float(el) for el in subdomain[coordinates_id].split(', ')]
        # 
        
    subdomains_data[subdomain[alias_id]] = vals

print(subdomains_data)

# file = open(file_name,'w',encoding='utf-8')
# file.write('---\n')
# file.write(front_matter_yaml)
# file.write('---\n')
# file.write(content)
# file.close

with codecs.open('../subdomains.json', 'w', encoding='utf-8') as outfile:
    json.dump(subdomains_data, outfile, ensure_ascii=False, indent=2)
    # json.dump(subdomains_data, outfile, indent=4)

# with codecs.open('your_file.txt', 'w', encoding='utf-8') as f:
#     json.dump({"message":"xin chào việt nam"}, f, ensure_ascii=False)