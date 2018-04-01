/**
* Thumbnail Helper
* @description Get the thumbnail url from a post
* @example
*     <%- thumbnail(post) %>
*/

// Вывод тега H1
hexo.extend.helper.register('h1Escape', function (page) {
    var seoH1 = null;
    if (page.seo) {
        if (page.seo.h1 != "") {
            seoH1 = page.seo.h1;
        }
    }
    return seoH1 || page.longtitle || page.title || '';
});

// Вывод тега title
hexo.extend.helper.register('titleEscape', function (page, config) {
    var seoTitle = null;
    if (page.seo) {
        if (page.seo.title != "") {
            seoTitle = page.seo.title;
        }
        
    }
    seoTitleReturn = seoTitle || page.longtitle || page.title || '';
    if (config.subdomain.inCity !== undefined && config.subdomain.inCity != '') {
        seoTitleReturn = seoTitleReturn + " " + config.subdomain.inCity;
    }
    return seoTitleReturn;
});

// Вывод тега description
hexo.extend.helper.register('descriptionEscape', function (page) {
    var seoDescription = "";
    if (page.seo) {
        if (page.seo.description && page.seo.description != "") {
            seoDescription = '<meta name="description" content="' + page.seo.description + '" />';
        }
    }
    return seoDescription || '';
});

// Вывод тега keywords
hexo.extend.helper.register('keywordsEscape', function (page) {
    var seoKeywords = "";
    if (page.seo) {
        if (page.seo.keywords && page.seo.keywords != "") {
            seoKeywords = '<meta name="keywords" content="' + page.seo.keywords + '" />';
        }
        
    }
    return seoKeywords || '';
});

// Вывод тега title
hexo.extend.helper.register('listTitle', function (page) {
    var listTitle = null;
    if ((page.listtitle !== undefined) && (page.listtitle != '')) {
        listTitle = page.listtitle
    }
    return listTitle || page.title || '';
});

hexo.extend.helper.register('thumbnail_list', function (page) {
    return page.thumbnail || '/assets/images/no_image.png';
});

hexo.extend.helper.register('banner_image', function (page) {
    return page.banner || '/assets/images/no_image.png';
});

hexo.extend.helper.register('alt_image', function (page) {
    return page.altimage || page.longtitle || page.title || '';
});