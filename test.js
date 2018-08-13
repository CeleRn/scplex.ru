'use strick';

var marked = require('marked');

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pendantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
  });



value = '### Header\n\n* list 1\n* list 2';

var result = marked(value);

console.log(result);