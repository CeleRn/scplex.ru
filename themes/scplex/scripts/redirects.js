var config = hexo.config;
var subdomainAlias = config.subdomain.alias;
var nameSiteInNetlify = config.netlify.name;

var currentUrl = config.url;

if (subdomainAlias == 'master') {
    var netlifyAddress = 'https://' + nameSiteInNetlify + '.netlify.com';
} else {
    var netlifyAddress = 'https://' + subdomainAlias + '--' + nameSiteInNetlify + '.netlify.com';
};
var redirectRule = netlifyAddress + '/*' + ' ' +  currentUrl + '/:splat 301!'

hexo.extend.generator.register('redirects', function(locals){
    return {
        path: '_redirects',
        data: redirectRule
    };
});

