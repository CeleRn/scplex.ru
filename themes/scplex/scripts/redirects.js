var config = hexo.config;
var subdomainAlias = config.subdomain.alias;
var nameSiteInNetlify = config.netlify.name;

var currentUrl = config.url;


var netlifyMasterAddress = 'https://' + nameSiteInNetlify + '.netlify.com';
var netlifyAddressWithAlias = 'https://' + subdomainAlias + '--' + nameSiteInNetlify + '.netlify.com';

if (subdomainAlias == 'master') {
    var redirectRule = netlifyAddressWithAlias + '/*' + ' ' +  currentUrl + '/:splat 301!' + "\n"
    redirectRule += netlifyMasterAddress + '/*' + ' ' +  currentUrl + '/:splat 301!'
} else {
    var redirectRule = netlifyAddressWithAlias + '/*' + ' ' +  currentUrl + '/:splat 301!'
};



hexo.extend.generator.register('redirects', function(locals){
    return {
        path: '_redirects',
        data: redirectRule
    };
});

