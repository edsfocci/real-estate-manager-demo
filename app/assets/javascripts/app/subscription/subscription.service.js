'use strict';

angular.
  module('subscription').
  service('subscription', SubscriptionService);

function SubscriptionService() {
  this.getSubscription = getSubscription;
  this.setSubscription = setSubscription;


  function getSubscription() {
    this.subscription = this.subscription || window.user.subscription;

    return this.subscription;
  }

  function setSubscription(updatedSubscription) {
    for (var key in this.subscription)
      delete this.subscription[key];

    for (var key in updatedSubscription)
      this.subscription[key] = updatedSubscription[key];
  }
}
