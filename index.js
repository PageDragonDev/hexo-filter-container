/* global hexo */

var assign = require('object-assign');
var markup = '^\:\:\:(.*)';

hexo.config.container = assign({ markup: markup }, hexo.config.container);
var placeholder = (hexo.config.container.markup || markup);
var reg = new RegExp(placeholder, 'gm');

function parse(data) {
  var source = data.source;
  var ext = source.substring(source.lastIndexOf('.')).toLowerCase();
  
  if (['.js', '.css', '.html', '.htm'].indexOf(ext) > -1) {
    return;
  }

  var changed = false;
  var returnedMarkup = data.content.replace(reg, function (raw, classNames) {
    classNames = classNames.trim();

    var ret = "";
    if(classNames.length > 0) {
      ret  = '{% raw %}<div class="' + classNames + '">{% endraw %}';
    } else {
      ret =  '{% raw %}</div>{% endraw %}';
    }
    changed = true;
    return ret;
  });
  
  if(changed) {
    data.content = returnedMarkup;
  }
}

hexo.extend.filter.register('before_post_render', parse, 9);