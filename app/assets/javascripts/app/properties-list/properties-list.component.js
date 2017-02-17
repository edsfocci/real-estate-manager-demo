'use strict';

angular.
  module('propertiesList').
  component('propertiesList', {
    templateUrl: 'properties-list.html',
    controller: PropertiesListController
  });

PropertiesListController.$inject = ['propertiesList', 'propertiesForm',
                                    'propertiesDetail'];

function PropertiesListController(propertiesList, propertiesForm,
                                  propertiesDetail) {
  this.properties = propertiesList.getProperties();

  var forSaleCount = this.properties.filter(function(property) {
    return property.for_sale;
  }).length;
  propertiesDetail.setForSaleCount(forSaleCount);

  /* Event handlers */
  this.selectProperty = function(property) {
    propertiesForm.setProperty(property);
    propertiesDetail.setProperty(property);
  };
}
