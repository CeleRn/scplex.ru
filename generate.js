var fs = require('fs');
var jsonfile = require('jsonfile');
var readYaml = require('read-yaml');
var yaml = require('write-yaml');
var Hexo = require('hexo');


// Файл со списком поддоменов и данными для них
var file = 'subdomains.json'

// Чтение файла и создание массива со всеми данными
var dataSubdomains = jsonfile.readFileSync(file);

// Создание массива только с поддоменами... [moskow, smolensk, и т.д.]
var subdomains = Object.keys(dataSubdomains);
var countSubsomain = subdomains.length;
console.log(subdomains);

var hexo = new Object;
function generateSubdomain(alias) {
    hexo[alias] = new Hexo(process.cwd(), {
        config: "configs/" + alias + ".yml"
    });
    hexo[alias].init().then(function () {
        return hexo[alias].call('generate', {
            watch: false
        });
    }).then(function () {
        return hexo[alias].exit();
    }).then(function () {
        return "все ок"
    }).catch(function (err) {
        console.log(err);
        hexo[alias].exit(err);
    })
}


for (var i = 0; i < subdomains.length; i++) {
    generateSubdomain(subdomains[i]);
}
