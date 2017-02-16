'use strict';

angular.
  module('propertiesDetail').
  component('propertiesDetail', {
    template:
      '<div ng-repeat="property in $ctrl.properties">' +
        '<a href="#" id="{{property._id.$oid}}">' +
          '<span class="property_address">' +
            '{{property.address}} {{property.state}} Texas' +
          '</span>' +
          '<span class="property_status">' +
            '{{property.for_sale | forSale}}' +
          '</span>' +
        '</a>' +
      '</div>',
    controller: PropertyListController
  });

function PropertyListController() {
  var properties = window.user.subscription.properties;

  this.properties = properties.map(setPropertyState);
}

function setPropertyState(property) {
  if ('bedrooms' in property)
    property.state = 'Dallas';

  if ('kitchen' in property)
    property.state = 'Austin';

  if ('pool' in property)
    property.state = 'Houston';

  return property;
}
