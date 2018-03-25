# -*- coding: utf-8 -*-

import subprocess
import os


dir_list = next(os.walk('./public'))[1]

for subdomain in dir_list:
    print("Деплоиться поддомен: " + subdomain)
    proc = subprocess.Popen("hexo deploy --config configs/" + subdomain + ".yml", shell=True, stdout=subprocess.PIPE)
    out = proc.stdout.readlines()
    


