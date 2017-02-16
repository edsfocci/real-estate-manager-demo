'use strict';

angular.
  module('subscription').
  component('subscription', {
    template: '',
    controller: SubscriptionController
  });

function SubscriptionController() {
  this.subscription = {
    plan_number: 1
  };
}
