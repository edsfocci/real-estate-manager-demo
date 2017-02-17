'use strict';

angular.
  module('propertiesForm').
  component('propertiesForm', {
    templateUrl: 'properties-form.html',
    controller: PropertiesFormController
  });

PropertiesFormController.$inject = ['$scope', '$http', 'core', 'propertiesForm',
                                    'propertiesList', 'propertiesDetail'];

function PropertiesFormController($scope, $http, core, propertiesForm,
                                  propertiesList, propertiesDetail) {
  $scope.states = [
    'Dallas',
    'Austin',
    'Houston'
  ];

  this.property = propertiesForm.getProperty();


  /* Event handlers */
  this.submitForm = function() {
    var propertyId = this.property._id && this.property._id.$oid;
    var propertyData = { property: {} };
    var promise;

    for (var key in this.property)
      propertyData.property[key] = this.property[key];

    propertyData.property.state += 'Property';

    if (propertyId)
      promise = $http.patch('/properties/' + propertyId, propertyData);
    else
      promise = $http.post('/properties/', propertyData);

    promise.then(function(response) {
      var submittedProperty = core.setPropertyState(response.data);

      propertiesForm.setProperty(submittedProperty);
      propertiesDetail.setProperty(submittedProperty);
      propertiesList.updateProperty(submittedProperty);

      if (propertyId)
        core.triggerAlert('Property updated.');
      else
        core.triggerAlert('Property added.');
    });
  };

  this.clearForm = function() {
    propertiesForm.setProperty({});
  };
}
