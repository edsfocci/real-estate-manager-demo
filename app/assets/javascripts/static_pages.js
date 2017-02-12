'use strict';


$(function() {
  var $propertyForm       = $('#property-form');
  var $stateInput         = $('#state');
  var $stateAll           = $('.state-all');
  var $stateDependent     = $('.state-dependent');
  var $newPropertyBtn     = $('#new-property');
  var $sellPane           = $('#sell');
  var $propertiesList     = $('#properties-list');

  var propertyFieldsDict  = {
    'Dallas':   ['address', 'roof_type', 'bedrooms', 'bathrooms'],
    'Austin':   ['address', 'roof_type', 'dining_area', 'kitchen'],
    'Houston':  ['address', 'roof_type', 'pool', 'garage']
  };
  var radioInputSet       = {
    'dining_area': null, 'kitchen': null, 'pool': null, 'garage': null
  };
  var textInputs          = ['address', 'roof_type', 'bedrooms', 'bathrooms'];
  var radioInputs         = ['dining_area', 'kitchen', 'pool', 'garage'];
  var properties          = window.user.subscription.properties;
  var propertiesDict      = {};
  var forSaleCount        = 0;

  showStateForm();

  for (var i = 0; i < properties.length; i++)
    updateProperty(properties[i]);

  // Submit change in subscription's plan_number
  $('#subscribe-form').submit(function(e) {
    e.preventDefault();
  });

  $stateInput.change(function() {
    showStateForm();
  });

  $newPropertyBtn.click(function(e) {
    e.preventDefault();

    // Hide Property tab-pane elements
    $stateAll.hide();
    $stateDependent.hide();
    $newPropertyBtn.hide();

    clearPropertyInputs();
  });

  $propertyForm.submit(function(e) {
    e.preventDefault();

    var property        = {
      'state': stringHumanReadable($stateInput.val())
    };
    var propertyFields  = propertyFieldsDict[property.state];
    var propertyId      = $('#property-id').val();
    var promise;

    if (propertyId)
      property.id = propertyId;

    for (var i = 0; i < propertyFields.length; i++) {
      if (propertyFields[i] in radioInputSet) {
        if ($('#yes-' + propertyFields[i]).prop('checked'))
          property[propertyFields[i]] = true;
        else if ($('#no-' + propertyFields[i]).prop('checked'))
          property[propertyFields[i]] = false;
      }
      else if (typeof $('#' + propertyFields[i]).val() === 'string' &&
          $('#' + propertyFields[i]).val().trim())
        property[propertyFields[i]] = $('#' + propertyFields[i]).val().trim();
      else if ($('#' + propertyFields[i]).val())
        property[propertyFields[i]] = $('#' + propertyFields[i]).val();
    }

    property.state += 'Property';
    property = { 'property': property };

    if (property.property.id)
      promise = $.ajax('/properties/' + property.property.id, {
        'method': 'PATCH',
        'data':   property
      });
    else
      promise = $.post('/properties/', property);

    promise.done(updateProperty);
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

  /* Helper functions: tab-pane-specific */
  function clearPropertyInputs() {
    $stateInput.val(null);
    $('#property-id').remove();
    for (var i = 0; i < textInputs.length; i++)
      $('#' + textInputs[i]).val(null);
    for (var i = 0; i < radioInputs.length; i++) {
      $('#no-'  + radioInputs[i]).prop('checked', false);
      $('#yes-' + radioInputs[i]).prop('checked', false);
    }
  }

  function updateSellPane(property) {
    var $missingFields      = $('#missing-fields');
    var $missingFieldsUl    = $('#missing-fields ul');
    var $sellFormSubmit     = $('#sell-form input');

    var propertyFields      = propertyFieldsDict[property.state];
    var missingFieldsCount  = 0;

    $missingFieldsUl.empty();

    for (var i = 0; i < propertyFields.length; i++) {
      if (property[propertyFields[i]] === null) {
        $missingFieldsUl.append(
          $('<li/>').html('- ' + stringHumanReadable(propertyFields[i])));
        missingFieldsCount++;
      } else if (typeof property[propertyFields[i]] === 'string') {
        if (!property[propertyFields[i]].trim()) {
          $missingFieldsUl.append(
            $('<li/>').html('- ' + stringHumanReadable(propertyFields[i])));
          missingFieldsCount++;
        }
      }
    }

    $('#property-not-selected').hide();
    $('#property-info').show();
    $missingFields.hide();

    $('#property-info > h1').html(propertyFullAddress(property));
    $('#percent_complete').html(100 - (25 * missingFieldsCount));

    if (property.for_sale)
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
  }

  /* Helper function: Property model */
  function updateProperty(updateData) {
    var $propertyLink;
    var oldData = propertiesDict[updateData._id.$oid];

    updateData.state = findPropertyState(updateData);

    if (oldData) {
      $propertyLink = oldData.$propertyLink;

      $propertyLink.children('.property_address')
        .html(propertyFullAddress(updateData));

      if (updateData.for_sale)
        $propertyLink.children('.property_status').html('For Sale');
      else
        $propertyLink.children('.property_status').html('Pending');

      updateData.$propertyLink = $propertyLink;

    } else {
      $propertyLink = $('<a/>', {
        id:   updateData._id.$oid,
        href: '#'
      })
      .append($('<span/>', {
        class: 'property_address'
      }).html(propertyFullAddress(updateData)))
      .click(function(e) {
        e.preventDefault();

        var $this             = $(this);

        var selectedProperty  = propertiesDict[$this.prop('id')];
        var propertyFields    = propertyFieldsDict[selectedProperty.state];

        clearPropertyInputs();

        for (var i = 0; i < propertyFields.length; i++) {
          if (propertyFields[i] in radioInputSet) {
            if (selectedProperty[propertyFields[i]] === true)
              $('#yes-' + propertyFields[i]).click();
            else if (selectedProperty[propertyFields[i]] === false)
              $('#no-' + propertyFields[i]).click();
          } else {
            if (selectedProperty[propertyFields[i]] === '')
              selectedProperty[propertyFields[i]] = null;

            $('#' + propertyFields[i]).val(selectedProperty[propertyFields[i]]);
          }
        }

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

        updateSellPane(selectedProperty);
      });

      updateData.$propertyLink = $propertyLink;

      if (updateData.for_sale) {
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

    updateSellPane(updateData);

    propertiesDict[updateData._id.$oid] = updateData;
  }

  function findPropertyState(property) {
    if ('bedrooms' in property)
      return 'Dallas';

    if ('kitchen' in property)
      return 'Austin';

    if ('pool' in property)
      return 'Houston';
  }

  /* Helper functions: formatting */
  function propertyFullAddress(property) {
    if (!property.state)
      throw 'property.state not exist';


    if (property.address)
      return (property.address + ' ' + property.state + ' Texas').trim();
    else
      return (property.state + ' Texas').trim();
  }

  function stringHumanReadable(string) {
    string = string.split('_');
    for (var i = 0; i < string.length; i++)
      string[i] = string[i].charAt(0).toUpperCase() + string[i].slice(1);

    return string.join(' ');
  }
});
