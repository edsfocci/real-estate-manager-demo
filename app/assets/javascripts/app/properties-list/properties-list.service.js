'use strict';

angular.
  module('propertiesList').
  service('propertiesList', PropertiesListService);

function PropertiesListService() {
  this.getProperties = getProperties;
  this.addProperty = addProperty;
  this.updateProperty = updateProperty;
}

function getProperties() {
  this.properties = this.properties ||
                    window.user.subscription.properties.map(setPropertyState);

  return this.properties;
}

function addProperty(newProperty) {
  this.properties.push(newProperty);
}

function updateProperty(updatedProperty) {

  var oldProperty = this.properties.filter(function(property) {
    return property._id.$oid === updatedProperty._id.$oid;
  })[0];

  if (oldProperty) {
    for (var key in oldProperty) {
      if (key === '$$hashKey')
        continue;

      delete oldProperty[key];
    }

    for (var key in updatedProperty)
      oldProperty[key] = updatedProperty[key];
  }
  else
    this.addProperty(updatedProperty);
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
