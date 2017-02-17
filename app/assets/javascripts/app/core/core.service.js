'use strict';

angular.
  module('core').
  service('core', CoreService);

/* Helper functions */
function CoreService() {
  this.setPropertyState = setPropertyState;
  this.triggerAlert     = triggerAlert;


  function setPropertyState(property) {
    if ('bedrooms' in property)
      property.state = 'Dallas';

    if ('kitchen' in property)
      property.state = 'Austin';

    if ('pool' in property)
      property.state = 'Houston';

    return property;
  }

  function triggerAlert(message) {
    var $alertMessage = $('#dash-alert');

    $alertMessage
      .html(message)
      .fadeIn();

    setTimeout(function() {
      $alertMessage.fadeOut();
    }, 3000);
  }
}
