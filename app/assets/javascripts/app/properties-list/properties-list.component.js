'use strict';

angular.
  module('propertiesList').
  component('propertiesList', {
    templateUrl: 'properties-list.html',
    controller: PropertiesListController
  });

PropertiesListController.$inject = ['$http', 'core', 'propertiesList',
                                    'propertiesForm', 'propertiesDetail',
                                    'propertiesRemove'];

function PropertiesListController($http, core, propertiesList, propertiesForm,
                                  propertiesDetail, propertiesRemove) {
  this.properties = propertiesList.getProperties();

  var forSaleCount = this.properties.filter(function(property) {
    return property.for_sale;
  }).length;
  propertiesDetail.setForSaleCount(forSaleCount);


  /* Event handlers */
  this.selectProperty = function(property) {
    propertiesForm.setProperty(property);
    propertiesDetail.setProperty(property);

    if ($('#dash-alert').css('display') === 'none')
      core.triggerAlert('Property selected.');
  };

  this.deletePropertyConfirm = function(property) {
    propertiesRemove.deletePropertyConfirm(property);
  }
}
