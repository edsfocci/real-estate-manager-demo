'use strict';

angular.
  module('propertiesList').
  service('propertiesList', PropertiesListService);

PropertiesListService.$inject = ['core'];

function PropertiesListService(core) {
  this.getProperties  = getProperties;
  this.addProperty    = addProperty;
  this.updateProperty = updateProperty;
  this.deleteProperty = deleteProperty;


  function getProperties() {
    this.properties = this.properties ||  window.user.subscription.properties
                                            .map(core.setPropertyState);

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

  function deleteProperty(propertyId) {
    var doomedProperty = this.properties.filter(function(property) {
      return property._id.$oid === propertyId;
    })[0];
    var doomedIndex = this.properties.indexOf(doomedProperty);

    this.properties.splice(doomedIndex, 1);
  }
}
