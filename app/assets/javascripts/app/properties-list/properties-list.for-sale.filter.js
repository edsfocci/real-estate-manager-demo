'use strict';

angular.
  module('propertiesList').
  filter('forSale', ForSaleFilter);

function ForSaleFilter() {
  return function(input) {
    return input ? 'For Sale' : 'Pending';
  };
}
