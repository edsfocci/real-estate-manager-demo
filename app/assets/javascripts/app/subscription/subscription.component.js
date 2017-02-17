'use strict';

angular.
  module('subscription').
  component('subscription', {
    templateUrl: 'subscription.html',
    controller: SubscriptionController
  });

SubscriptionController.$inject = ['$scope', '$http', 'subscription'];

function SubscriptionController($scope, $http, subscription) {
  $scope.planNumbers = [1, 2, 3];

  this.subscription = subscription.getSubscription();

  /* Event handlers */
  this.submitForm = function() {
    var subscriptionId = this.subscription._id.$oid;
    var subscriptionData = { subscription: this.subscription };

    $http.patch('/subscriptions/' + subscriptionId, subscriptionData)
    .then(function(response) {
      var submittedSubscription = response.data;

      subscription.setSubscription(submittedSubscription);

      window.appHelpers.triggerAlert('Subscription updated.');
    });
  };
}
