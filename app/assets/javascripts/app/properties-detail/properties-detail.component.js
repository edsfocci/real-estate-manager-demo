'use strict';

angular.
  module('propertiesDetail').
  component('propertiesDetail', {
    templateUrl: 'properties-detail.html',
    controller: PropertiesDetailController
  });

PropertiesDetailController.$inject = ['$http', 'core', 'propertiesDetail',
                                      'subscription', 'propertiesList'];

function PropertiesDetailController($http, core, propertiesDetail, subscription,
                                    propertiesList) {
  this.property     = propertiesDetail.getProperty();
  this.forSaleCount = propertiesDetail.getForSaleCount();
  propertiesDetail.setSubscription(subscription.getSubscription());
  this.subscription = propertiesDetail.getSubscription();


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
      var submittedProperty = core.setPropertyState(response.data);

      if (submittedProperty.for_sale)
        self.forSaleCount.forSaleCount++;
      else
        self.forSaleCount.forSaleCount--;

      propertiesDetail.setProperty(submittedProperty);
      propertiesList.updateProperty(submittedProperty);

      if (submittedProperty.for_sale)
        core.triggerAlert('Property is now for sale.');
      else
        core.triggerAlert('Property is no longer for sale.');
    });
  };
}
