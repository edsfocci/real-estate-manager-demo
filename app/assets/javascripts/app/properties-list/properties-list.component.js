'use strict';

angular.
  module('propertiesList').
  component('propertiesList', {
    templateUrl: 'properties-list.html',
    controller: PropertiesListController
  });

PropertiesListController.$inject = ['$http', 'core', 'propertiesList',
                                    'propertiesForm', 'propertiesDetail'];

function PropertiesListController($http, core, propertiesList, propertiesForm,
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

    if ($('#dash-alert').css('display') === 'none')
      core.triggerAlert('Property selected.');
  };

  this.deleteProperty = function(property) {
    window.wawaw = property;
    var propertyId = property._id.$oid;

    $http.delete('/properties/' + propertyId)
    .then(function(response) {
      propertiesList.deleteProperty(response.data._id.$oid);

      core.triggerAlert('Property removed.');
    });
  }
}
