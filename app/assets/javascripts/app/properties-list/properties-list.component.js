'use strict';

angular.
  module('propertiesList').
  component('propertiesList', {
    templateUrl: 'properties-list.html',
    controller: PropertiesListController
  });

PropertiesListController.$inject = ['propertiesList', 'propertiesForm'];

function PropertiesListController(propertiesList, propertiesForm) {
  this.properties = propertiesList.getProperties();

  /* Event handlers */
  this.selectProperty = function(property) {
    propertiesForm.setProperty(property);
  };
}
