'use strict';


$(function() {
  var $propertyForm   = $('#property-form');
  var $stateInput     = $('#state');
  var $stateAll       = $('.state-all');
  var $stateDependent = $('.state-dependent');
  var $newPropertyBtn = $('#new-property');
  var $sellPane       = $('#sell');
  var $propertiesList = $('#properties-list');
  var properties      = window.user.subscription.properties;
  var propertiesDict  = {};
  var forSaleCount    = 0;

  showStateForm();

  for (var i = 0; i < properties.length; i++) {
    var propertyFullAddress = [properties[i].address];

    if ('bedrooms' in properties[i])
      properties[i].state = 'Dallas';
    else if ('kitchen' in properties[i])
      properties[i].state = 'Austin';
    else if ('pool' in properties[i])
      properties[i].state = 'Houston';

    propertyFullAddress.push(properties[i].state);
    propertyFullAddress.push('Texas');
    propertyFullAddress = propertyFullAddress.join(' ');

    propertiesDict[properties[i]._id.$oid] = properties[i];

    var $propertyLink = $('<a/>', {
      id:   properties[i]._id.$oid,
      href: '#'
    })
    .append($('<span/>', {
      class: 'property_address'
    }).html(propertyFullAddress))
    .click(function(e) {
      e.preventDefault();

      var $this             = $(this);
      var $missingFields    = $('#missing-fields');
      var $missingFieldsUl  = $('#missing-fields ul');
      var $sellFormSubmit   = $('#sell-form input');

      var selectedProperty  = propertiesDict[$this.prop('id')];
      var propertyFields    = {
        'Dallas':   ['address', 'roof_type', 'bedrooms', 'bathrooms'],
        'Austin':   ['address', 'roof_type', 'dining_area', 'kitchen'],
        'Houston':  ['address', 'roof_type', 'pool', 'garage']
      }[selectedProperty.state];
      var missingFieldsCount = 0;

      $missingFieldsUl.empty();

      for (var j = 0; j < propertyFields.length; j++) {
        /* Property tab-pane */
        if (propertyFields[j] in {
              'dining_area': null, 'kitchen': null, 'pool': null, 'garage': null
            }) {
          if (selectedProperty[propertyFields[j]] === true)
            $('#yes-' + propertyFields[j]).click();
          else if (selectedProperty[propertyFields[j]] === false)
            $('#no-' + propertyFields[j]).click();
        }
        else
          $('#' + propertyFields[j]).val(selectedProperty[propertyFields[j]]);

        /* Sell tab-pane */
        if (selectedProperty[propertyFields[j]] === null) {
          $missingFieldsUl.append(
            $('<li/>').html('- ' + fieldHumanReadable(propertyFields[j])));
          missingFieldsCount++;
        } else if (typeof selectedProperty[propertyFields[i]] === 'string') {
          if (!selectedProperty[propertyFields[j]].trim()) {
            $missingFieldsUl.append(
              $('<li/>').html('- ' + fieldHumanReadable(propertyFields[j])));
            missingFieldsCount++;
          }
        }
      }

      /* Property tab-pane */
      $stateInput
      .val(selectedProperty.state.toLowerCase())
      .change();
      $newPropertyBtn.show();
      $propertyForm.append($('<input/>', {
        id:   'property-id',
        type: 'hidden',
        name: 'property[id]'
      })
      .val(selectedProperty._id.$oid));

      /* Sell tab-pane */
      $('#property-not-selected').hide();
      $('#property-info').show();
      $missingFields.hide();

      $('#property-info > h1').html($this.children('.property_address').html());
      $('#percent_complete').html(100 - (25 * missingFieldsCount));

      if (selectedProperty.for_sale)
        $sellFormSubmit
        .val('Unsell House')
        .removeClass('disabled');
      else {
        $sellFormSubmit.val('Sell House');

        if (forSaleCount >= window.user.subscription.plan_number) {
          $sellFormSubmit.addClass('disabled');

          if (missingFieldsCount)
            $missingFields.show();
        } else if (missingFieldsCount) {
          $missingFields.show();
          $sellFormSubmit.addClass('disabled');
        }
        else
          $sellFormSubmit.removeClass('disabled');
      }
    });

    if (properties[i].for_sale) {
      $propertyLink.append($('<span/>', {
        class: 'property_status'
      }).html('For Sale'));

      forSaleCount++;
    }
    else
      $propertyLink.append($('<span/>', {
        class: 'property_status'
      }).html('Pending'));

    $propertiesList
    .append($('<div/>')
      .append($propertyLink));
  }

  // Submit change in subscription's plan_number
  $('#subscribe-form').submit(function(e) {
    e.preventDefault();
  });

  $stateInput.change(function() {
    showStateForm();
  });

  $newPropertyBtn.click(function(e) {
    e.preventDefault();

    var textInputs = ['address', 'roof_type', 'bedrooms', 'bathrooms'];
    var radioInputs = ['dining_area', 'kitchen', 'pool', 'garage'];

    // Hide Property tab-pane elements
    $stateAll.hide();
    $stateDependent.hide();
    $newPropertyBtn.hide();

    // Clear inputs
    $stateInput.val(null);
    $('#property-id').remove();
    for (var i = 0; i < textInputs.length; i++)
      $('#' + textInputs[i]).val(null);
    for (var i = 0; i < radioInputs.length; i++) {
      $('#no-'  + radioInputs[i]).prop('checked', false);
      $('#yes-' + radioInputs[i]).prop('checked', false);
    }
  });

  $propertyForm.submit(function(e) {
    e.preventDefault();
  });

  $('#sell-form').submit(function(e) {
    e.preventDefault();
  });

  function showStateForm() {
    var stateChosen = $stateInput.val();

    if (stateChosen) {
      $stateAll.show();
      $stateDependent.hide();

      $('#state-' + stateChosen).show();
    }
  }

  function fieldHumanReadable(field) {
    field = field.split('_');
    for (var i = 0; i < field.length; i++)
      field[i] = field[i].charAt(0).toUpperCase() + field[i].slice(1);

    return field.join(' ');
  }
});
