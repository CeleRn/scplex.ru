# -*- coding: utf-8 -*-

import os
import yaml

file_name="output.md"
content = "Контент файла\n\nВторая строка"
metadata = {
    'layout': 'services-list', 
    'title': 'Компьютер',
    'seo': {
        'title': 'Title компьютер',
        'keywords': ['Компьютер', 'Ноутбук']
    }
}

def save_file_md(file_name, front_matter, content):
    # Преобразование объекта Python в формат yaml для md файла
    front_matter_yaml = yaml.dump(front_matter, encoding='utf-8', allow_unicode=True, default_flow_style=False)
    front_matter_yaml = front_matter_yaml.decode("utf-8", "ignore")
    # Запись в файл
    file = open(file_name,'w',encoding='utf-8')
    file.write('---\n')
    file.write(front_matter_yaml)
    file.write('---\n')
    file.write(content)
    file.close

save_file_md(file_name, metadata, content)