'use strict';

angular.
  module('propertiesDetail').
  service('propertiesDetail', PropertiesDetailService);

function PropertiesDetailService() {
  this.getProperty = getProperty;
  this.setProperty = setProperty;
  this.getForSaleCount = getForSaleCount;
  this.setForSaleCount = setForSaleCount;
}

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
