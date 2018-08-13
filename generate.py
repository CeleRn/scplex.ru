# -*- coding: utf-8 -*-

import subprocess
import os
import json

file = 'subdomains.json'

subdomains_json = json.loads(open(file, encoding="utf-8").read())

for subdomain in subdomains_json:
    try:
        os.remove('db.json')
        print('файл db.json удален')
    except(OSError):
        print('файл db.json отсутствует')
    print("Создается контент поддомена: " + subdomain)
    proc = subprocess.Popen("hexo generate --config configs/" + subdomain + ".yml", shell=True, stdout=subprocess.PIPE)
    out = proc.stdout.readlines()