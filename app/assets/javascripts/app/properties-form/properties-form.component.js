'use strict';

angular.
  module('propertiesForm').
  component('propertiesForm', {
    templateUrl: 'properties-form.html',
    controller: PropertiesFormController
  });

PropertiesFormController.$inject = ['$scope', '$http',
                                    'propertiesForm', 'propertiesList'];

function PropertiesFormController($scope, $http,
                                  propertiesForm, propertiesList) {
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
      propertyData.property[key] = this.property[key]

    propertyData.property.state += 'Property';

    if (propertyId)
      promise = $http.patch('/properties/' + propertyId, propertyData);
    else
      promise = $http.post('/properties/', propertyData);

    promise.then(function(response) {
      var submittedProperty = setPropertyState(response.data);

      propertiesForm.setProperty(submittedProperty);
      propertiesList.updateProperty(submittedProperty);

      // if (propertiesDict[data._id.$oid])
      //   triggerAlert('Property updated.');
      // else
      //   triggerAlert('Property added.');
    });
  };

  this.clearForm = function() {
    propertiesForm.setProperty({});
  };
}

/* Helper function */
function setPropertyState(property) {
  if ('bedrooms' in property)
    property.state = 'Dallas';

  if ('kitchen' in property)
    property.state = 'Austin';

  if ('pool' in property)
    property.state = 'Houston';

  return property;
}
