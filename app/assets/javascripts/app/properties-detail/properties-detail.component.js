'use strict';

angular.
  module('propertiesDetail').
  component('propertiesDetail', {
    templateUrl: 'properties-detail.html',
    controller: PropertiesDetailController
  });

PropertiesDetailController.$inject = ['$http', 'propertiesDetail',
                                      'propertiesList', 'subscription'];

function PropertiesDetailController($http, propertiesDetail, propertiesList,
                                    subscription) {
  this.property     = propertiesDetail.getProperty();
  this.forSaleCount = propertiesDetail.getForSaleCount();
  this.subscription = subscription.getSubscription();
  propertiesDetail.setSubscription(this.subscription);

  /* Event handlers */
  this.submitForm = function() {
    var self = this;
    var propertyId = this.property._id.$oid;
    var propertyData = { property: {} };

    for (var key in this.property)
      propertyData.property[key] = this.property[key];

    propertyData.property.for_sale = !propertyData.property.for_sale;

    $http.patch('/properties/' + propertyId, propertyData)
    .then(function(response) {
      var submittedProperty = setPropertyState(response.data);

      if (submittedProperty.for_sale)
        self.forSaleCount.forSaleCount++;
      else
        self.forSaleCount.forSaleCount--;

      propertiesDetail.setProperty(submittedProperty);
      propertiesList.updateProperty(submittedProperty);

      if (submittedProperty.for_sale)
        window.appHelpers.triggerAlert('Property is now for sale.');
      else
        window.appHelpers.triggerAlert('Property is no longer for sale.');
    });
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
