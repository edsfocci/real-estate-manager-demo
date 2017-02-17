'use strict';

angular.
  module('propertiesForm').
  service('propertiesForm', PropertiesFormService);

function PropertiesFormService() {
  this.getProperty    = getProperty;
  this.setProperty    = setProperty;
  this.removeProperty = removeProperty;


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

  function removeProperty(property) {
    if (this.property._id.$oid === property._id.$oid)
      this.setProperty({});
  }
}
