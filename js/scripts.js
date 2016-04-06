$(document).ready(function(){
  var ua = new UAParser();
  var sm = false;

  if (ua.getOS().name === 'Android'
   || ua.getOS().name === 'iOS'
   || ua.getOS().name === 'Windows Phone'
   || ua.getOS().name === 'BlackBerry'
   || ua.getOS().name === 'Firefox OS') {
    sm = true
  }

  if (sm) {
    $('body').addClass('sm');
  }

  // Add target="_blank" when user opens external link
  $('a').each(function() {
    var a = this;
    if (a.origin !== location.origin) {
    $(a).attr('target', '_blank');
    }
  });
});
