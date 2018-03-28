hexo.extend.helper.register('addClass', function (classElemment) {
  var textClass = '';
  if (classElemment != undefined && classElemment != '') {
    textClass = ' class="' + classElemment + '"';
  };
  return textClass;
});

hexo.extend.helper.register('isMainDomain', function (alias) {
  if (alias == 'master') {
    return true;
  } else {
    return false;
  }
});