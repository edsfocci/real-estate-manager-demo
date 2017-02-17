'use strict';

(function() {
  angular.
    module('propertiesForm').
    service('propertiesForm', PropertiesFormService);

  function PropertiesFormService() {
    this.getProperty = getProperty;
    this.setProperty = setProperty;
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
  }
})();
