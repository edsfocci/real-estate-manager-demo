$.fn.visible = function() {
  return this.css('visibility', 'visible');
};

$.fn.invisible = function() {
  return this.css('visibility', 'hidden');
};

$.fn.visFadeIn = function() {
  var that = this;

  return that.animate({ opacity: 1 }, 'fast', function() {
    that.css('visibility', 'visible');
  });
};

$.fn.visFadeOut = function() {
  var that = this;
  return that.animate({ opacity: 0 }, 'fast', function() {
    that.css('visibility', 'hidden');
  });
};

$.fn.visibilityToggle = function() {
  return this.css('visibility', function(i, visibility) {
    return (visibility == 'visible') ? 'hidden' : 'visible';
  });
};
