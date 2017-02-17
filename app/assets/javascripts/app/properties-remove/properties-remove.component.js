'use strict';

angular.
  module('propertiesRemove').
  component('propertiesRemove', {
    templateUrl: 'properties-remove.html',
    controller: PropertiesRemoveController
  });

PropertiesRemoveController.$inject = ['$http', 'core', 'propertiesRemove',
                                      'propertiesList', 'propertiesForm',
                                      'propertiesDetail'];

function PropertiesRemoveController($http, core, propertiesRemove,
                                    propertiesList, propertiesForm,
                                    propertiesDetail) {
  this.property = propertiesRemove.getProperty();


  /* Event handlers */
  this.deleteProperty = function(propertyId) {
    $http.delete('/properties/' + propertyId)
    .then(function(response) {
      var deletedProperty = response.data;

      propertiesList.deleteProperty(deletedProperty._id.$oid);
      propertiesForm.removeProperty(deletedProperty);
      propertiesDetail.removeProperty(deletedProperty);
      propertiesRemove.setProperty({});

      core.triggerAlert('Property removed.');
    });
  };
}
