var fs = require('fs');
var jsonfile = require('jsonfile');
var readYaml = require('read-yaml');
var yaml = require('write-yaml');
var Hexo = require('hexo');

//////////////////
// Конфигурация //
//////////////////

var file = 'subdomains.json' // Файл со списком поддоменов и данными для них
var protocol = 'https'; // Протокол по умолчанию
var domain = 'scplex.ru'; // Домен
var aliasMain = 'master' // Алиас главного домена
var source = 'source'; // Контент поддоменов
var sourceMain = 'source_main' //Контент главного домена
var gitRepo = 'git@github.com:CeleRn/html_scplex.ru.git'; // Репозиторий для результата (HTML)

// Загрузка базового файла конфига
defaultConfig = readYaml.sync('_config.yml');

// Чтение файла базового конфига и создание массива со всеми данными
var dataSubdomains = jsonfile.readFileSync(file);

// Создание массива только с поддоменами... [moskow, smolensk, и т.д.]
var subdomains = Object.keys(dataSubdomains);

// Количество поддоменов вместе с главным
var countSubsomain = subdomains.length; 

// Создание Списка поддоменов без главного
var subdomainsList = [];
for (var i = 0; i < subdomains.length; i++) {
    if (subdomains[i] != aliasMain) {
        subdomainsList[subdomainsList.length] = subdomains[i];
    }
}

// Сортировка массива городов по русскому названию
subdomainsList.sort(function(a,b) {
    var x = dataSubdomains[a].city.toLowerCase();
    var y = dataSubdomains[b].city.toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
});

// Создание файла _data/subdomains.yml
var subdomainsData = new Object;
for (var i = 0; i < subdomainsList.length; i++) {
    
    alias = subdomainsList[i];
    args = dataSubdomains[alias];
    subdomainsData[alias] = args['city'];
}
yaml.sync(__dirname + "/source/_data/subdomains.yml", subdomainsData)

// Создание файла _data/regions.yml
var regionsData = [];
for (var i = 0; i < subdomainsList.length; i++) {
    
    alias = subdomainsList[i];
    args = dataSubdomains[alias];
    regionsData[i] = {
        alias: alias,
        city: args['city'],
        inCity: args['inCity'],
        coordinates: args['coordinates'],
        address: args['address'],
        phone: args['phone'],
        yandex: args['yandex']
    };
}
yaml.sync(__dirname + "/source/_data/regions.yml", regionsData)

// Создание конфигов для поддоменов
for (var i = 0; i < subdomains.length; i++) {

    alias = subdomains[i];
    args = dataSubdomains[alias];

    // Сборка массива для файла конфигурации поддомена
    var currentConfig = new Object;
    
    // Исходная папка (разные для главного домена и поддоменов)
    if (alias == aliasMain) {
        currentConfig.source_dir = sourceMain;
    } else {
        currentConfig.source_dir = source;
    }
    
    // Папка для результата 
    currentConfig.public_dir = "public/" + alias;

    currentConfig.main_domain = domain;
    currentConfig.main_url = protocol + '://' + domain;

    // Поддомен
    currentConfig.protocol = protocol;
    if (alias == aliasMain) {
        currentConfig.url = protocol + '://' + domain;
    } else {
        currentConfig.url = protocol + '://' + alias + '.' + domain;
    }
    
    // robots.txt
    currentConfig.robotstxt = new Object;
    currentConfig.robotstxt.useragent = '*';
    currentConfig.robotstxt.sitemap = currentConfig.url + '/sitemap.xml';
    currentConfig.robotstxt.host = currentConfig.url;

    // Место для деплоя 
    currentConfig.deploy = new Object;
    currentConfig.deploy.type = "git";
    currentConfig.deploy.repo = gitRepo;
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

    // Группировка базового конфига и конфига поддомена
    Object.assign(configForSubdomain, currentConfig);

    // Запись файла поддомена
    yaml.sync(currentConfigFile, configForSubdomain);
}
