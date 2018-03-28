var fs = require('fs');
var jsonfile = require('jsonfile');
var readYaml = require('read-yaml');
var yaml = require('write-yaml');
var Hexo = require('hexo');


defaultConfig = readYaml.sync('_config.yml');

// Файл со списком поддоменов и данными для них
var file = 'subdomains.json'

// Чтение файла и создание массива со всеми данными
var dataSubdomains = jsonfile.readFileSync(file);

// Создание массива только с поддоменами... [moskow, smolensk, и т.д.]
var subdomains = Object.keys(dataSubdomains);
var countSubsomain = subdomains.length;
console.log(subdomains);


// Создание файла _data/subdomains.yml
var subdomainsData = new Object;
for (var i = 0; i < subdomains.length; i++) {
    
    alias = subdomains[i];
    args = dataSubdomains[alias];
    if (alias != 'master') {
        subdomainsData[alias] = args['city'];
    }
}
yaml.sync(__dirname + "/source/_data/subdomains.yml", subdomainsData)



for (var i = 0; i < subdomains.length; i++) {

    alias = subdomains[i];
    args = dataSubdomains[alias];

    // Сборка массива для файла конфигурации поддомена
    var currentConfig = new Object;
    
    // Исходная папка
    if (alias == 'master') {
        currentConfig.source_dir = "source_main";
    } else {
        currentConfig.source_dir = "source";
    }
    
    // Папка для результата 
    currentConfig.public_dir = "public/" + alias;

    currentConfig.main_domain = "scplex.ru";
    currentConfig.main_url = "https://scplex.ru";

    // Поддомен
    if (alias == 'master') {
        currentConfig.url = 'https://scplex.ru'
    } else {
        currentConfig.url = 'https://' + alias + '.scplex.ru'
    }
    

    // Место для деплоя 
    currentConfig.deploy = new Object;
    currentConfig.deploy.type = "git";
    currentConfig.deploy.repo = "git@github.com:CeleRn/html_scplex.ru.git";
    currentConfig.deploy.branch = alias;

    // Дополнительные аргументы из основного JSON файла
    currentConfig.subdomain = new Object;
    for (arg in args) {
        currentConfig.subdomain[arg] = args[arg];
    }
    currentConfig.subdomain.alias = alias;

    // Имя файла конфигурации для данного поддомена
    currentConfigFile = __dirname + "/configs/" + alias + ".yml"
    // Запись файла конфигурации для данного поддомена
    var configForSubdomain = defaultConfig
    Object.assign(configForSubdomain, currentConfig);
    yaml.sync(currentConfigFile, configForSubdomain);


    // jsonfile.writeFile(currentConfigFile, currentConf, {
    //     spaces: 2
    // }, function (err) {
    //     console.error(err)
    // })
}
// var hexo = new Object;
// function generateSubdomain(alias) {
//     hexo[alias] = new Hexo(process.cwd(), {
//         config: "configs/" + alias + ".yml"
//     });
//     hexo[alias].init().then(function () {
//         return hexo[alias].call('generate', {
//             watch: false
//         });
//     }).then(function () {
//         return hexo[alias].exit();
//     }).then(function () {
//         return "все ок"
//     }).catch(function (err) {
//         console.log(err);
//         hexo[alias].exit(err);
//     })
// }


// for (var i = 0; i < subdomains.length; i++) {
//     generateSubdomain(subdomains[i]);
// }




// countSubsomain