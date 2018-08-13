# -*- coding: utf-8 -*-

import subprocess
import os
import json
from shutil import copyfile

# dir_list = next(os.walk('./public'))[1]
# print(dir_list)

# for subdomain in dir_list:
#     print("Деплоиться поддомен: " + subdomain)
#     proc = subprocess.Popen("hexo deploy --config configs/" + subdomain + ".yml", shell=True, stdout=subprocess.PIPE)
#     out = proc.stdout.readlines()


file = 'subdomains.json'

subdomains_json = json.loads(open(file, encoding="utf-8").read())

for subdomain in subdomains_json:
    print("Деплоиться поддомен: " + subdomain)
    try:
        copyfile('./cache/db_' + subdomain + '.json','db.json')
    except(OSError):
        print('файл ./cache/db_' + subdomain + '.json отсутствует')

    proc = subprocess.Popen("hexo deploy --config configs/" + subdomain + ".yml", shell=True, stdout=subprocess.PIPE)
    out = proc.stdout.readlines()
    # copyfile('db.json', './cache/db_' + subdomain + '.json' )
