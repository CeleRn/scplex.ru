



hexo.extend.generator.register(function(locals) {
    
    var nunjucks = require('nunjucks');
    var env = new nunjucks.Environment();
    var mdFilter = require('nunjucks-markdown-filter');
    var pathFn = require('path');
    var fs = require('fs');
    var marked = require('marked');

    env.addFilter('uriencode', function(str) {
        return encodeURI(str);
    });
    
    env.addFilter('noControlChars', function(str) {
        return str && str.replace(/[\x00-\x1F\x7F]/g, '');
    });

    // console.log(mdFilter.install('md', false));
    mdFilter.install(env, 'md');
    // env.addFilter('md', mdFilter);



    var searchTmplSrc = pathFn.join(__dirname, '../layout/rssturbo.xml');
    var searchTmpl = nunjucks.compile(fs.readFileSync(searchTmplSrc, 'utf8'), env);

    var config = this.config;
    var posts = locals.posts.toArray();


    var xml = searchTmpl.render({
        config: config,
        posts: posts,
        url: config.url,
        data: locals.data
      });
    
    return {
      path: "rssturbo.xml",
      data: xml
    };
  });