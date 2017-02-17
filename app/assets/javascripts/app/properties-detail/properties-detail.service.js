'use strict';

angular.
  module('propertiesDetail').
  service('propertiesDetail', PropertiesDetailService);

function PropertiesDetailService() {
  this.getProperty        = getProperty;
  this.setProperty        = setProperty;
  this.removeProperty     = removeProperty;
  this.getSubscription    = getSubscription;
  this.setSubscription    = setSubscription;
  this.getForSaleCount    = getForSaleCount;
  this.setForSaleCount    = setForSaleCount;
  this.updateSellPopover  = updateSellPopover;


  function getProperty() {
    this.property = this.property || {};

    return this.property;
  }

  function setProperty(property) {
    for (var key in this.property)
      delete this.property[key];

    for (var key in property)
      this.property[key] = property[key];

    addDetails(this.property);

    this.updateSellPopover();
  }

  function removeProperty(property) {
    if (this.property._id.$oid === property._id.$oid)
      this.setProperty({});
  }

  function getSubscription() {
    this.subscription = this.subscription || {};
    return this.subscription;
  }

  function setSubscription(subscription) {
    this.subscription = this.subscription || {};
    for (var key in this.subscription)
      delete this.subscription[key];

    for (var key in subscription)
      this.subscription[key] = subscription[key];
  }

  function getForSaleCount(forSaleCount) {
    this.forSaleCount = this.forSaleCount || { forSaleCount: 0 };
    return this.forSaleCount;
  }

  function setForSaleCount(forSaleCount) {
    if (this.forSaleCount)
      this.forSaleCount.forSaleCount = forSaleCount;
    else
      this.forSaleCount = { forSaleCount: forSaleCount };
  }

  function updateSellPopover() {
    var $sellFormSubmit = $('#sell-form input[type=submit]');
    var sellBtnMessage  = '';

    if (!this.property._id)
      return;

    if (this.property.missingFields.length)
      sellBtnMessage  = '<li>Fill in all missing fields to sell this ' +
                        'property.</li>';

    if (this.forSaleCount.forSaleCount >= this.subscription.plan_number)
      sellBtnMessage += '<li>Upgrade your subscription to sell more ' +
                        'properties.</li>';

    if (!this.property.for_sale && sellBtnMessage)
      sellBtnMessage = '<ul>' + sellBtnMessage + '</ul>';

    $sellFormSubmit.popover('destroy');

    // Delay to tame popover('destroy')
    setTimeout(function() {
      if (!this.property.for_sale && sellBtnMessage)
        $sellFormSubmit.popover({
          'content':  sellBtnMessage,
          'trigger':  'hover',
          'html':     true
        });
    }, 500);
  }


  /* Helper functions */
  function addDetails(property) {
    var propertyFieldsDict  = {
      Dallas:   ['address', 'roof_type', 'bedrooms', 'bathrooms'],
      Austin:   ['address', 'roof_type', 'dining_area', 'kitchen'],
      Houston:  ['address', 'roof_type', 'pool', 'garage']
    };
    var propertyFields  = propertyFieldsDict[property.state];
    var sellBtnMessage  = '';

    property.missingFields = [];

    for (var i = 0; i < propertyFields.length; i++) {
      if (property[propertyFields[i]] === null)
        property.missingFields
          .push('- ' + stringHumanReadable(propertyFields[i]));
      else if (typeof property[propertyFields[i]] === 'string') {
        if (!property[propertyFields[i]].trim())
          property.missingFields
            .push('- ' + stringHumanReadable(propertyFields[i]));
      }
    }
  }

  function stringHumanReadable(string) {
    string = string.split('_');
    for (var i = 0; i < string.length; i++)
      string[i] = string[i].charAt(0).toUpperCase() + string[i].slice(1);

    return string.join(' ');
  }
}
