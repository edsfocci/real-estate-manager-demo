'use strict';

angular.
  module('propertiesRemove').
  service('propertiesRemove', PropertiesRemoveService);

function PropertiesRemoveService() {
  this.getProperty            = getProperty;
  this.setProperty            = setProperty;
  this.deletePropertyConfirm  = deletePropertyConfirm;


  function getProperty() {
    this.property = this.property || {};

    return this.property;
  }

  function setProperty(property) {
    for (var key in this.property)
      delete this.property[key];

    for (var key in property)
      this.property[key] = property[key];
  }

  function deletePropertyConfirm(property) {
    this.setProperty(property);

    $('#property-remove-modal').modal('show');
  }
}
