var hexoConfig = hexo.config;

hexo.extend.tag.register('city', function () {
    if (hexoConfig.subdomain) {
        if (hexoConfig.subdomain.city != "") {
            return hexoConfig.subdomain.city;
        } else {
            return '';
        }
    } else {
        return '';
    }
});
hexo.extend.tag.register('inCity', function () {
    if (hexoConfig.subdomain) {
        if (hexoConfig.subdomain.inCity != "") {
            return hexoConfig.subdomain.inCity;
        } else {
            return '';
        }
    } else {
        return '';
    }
});