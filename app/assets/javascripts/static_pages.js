'use strict';


$(function() {
  window.dashboardInit = function () {
    var $alertMessage       = $('#dash-alert');
    var $planNumber         = $('#plan_number');
    var $propertyForm       = $('#property-form');
    var $stateInput         = $('#state');
    var $stateAll           = $('.state-all');
    var $stateDependent     = $('.state-dependent');
    var $newPropertyBtn     = $('#new-property');
    var $sellPane           = $('#sell');
    var $sellPropertyId     = $('#property-id-sell');
    var $sellFormSubmit     = $('#sell-form input[type=submit]');
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
    var subscription        = window.user.subscription;
    var properties          = subscription.properties;
    var propertiesDict      = {};
    var forSaleCount        = 0;

    $planNumber.val(subscription.plan_number);
    updateStateForm();

    for (var i = 0; i < properties.length; i++)
      updateProperty(properties[i]);

    // Submit change in subscription's plan_number
    $('#subscribe-form').submit(function(e) {
      e.preventDefault();

      var subscriptionData = {
        'subscription': {
          'plan_number': $planNumber.val()
        }
      };

      $.ajax('/subscriptions/' + subscription._id.$oid, {
        'method': 'PATCH',
        'data':   subscriptionData
      })
      .done(function(data) {
        subscription.plan_number = data.plan_number;
        if ($sellPropertyId.val())
          updateSellPane(propertiesDict[$sellPropertyId.val()]);

        triggerAlert('Subscription updated.');
      });
    });

    $stateInput.change(function() {
      updateStateForm();
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

      var propertyData    = {
        'state': stringHumanReadable($stateInput.val())
      };
      var propertyFields  = propertyFieldsDict[propertyData.state];
      var propertyId      = $('#property-id-edit').val();
      var promise;

      for (var i = 0; i < propertyFields.length; i++) {
        if (propertyFields[i] in radioInputSet) {
          if ($('#yes-' + propertyFields[i]).prop('checked'))
            propertyData[propertyFields[i]] = true;
          else if ($('#no-' + propertyFields[i]).prop('checked'))
            propertyData[propertyFields[i]] = false;
        }
        else if (typeof $('#' + propertyFields[i]).val() === 'string' &&
            $('#' + propertyFields[i]).val().trim())
          propertyData[propertyFields[i]] = $('#' + propertyFields[i]).val()
                                                                          .trim();
        else if ($('#' + propertyFields[i]).val())
          propertyData[propertyFields[i]] = $('#' + propertyFields[i]).val();
        else
          propertyData[propertyFields[i]] = null;
      }

      propertyData.state += 'Property';
      propertyData = { 'property': propertyData };

      if (propertyId)
        promise = $.ajax('/properties/' + propertyId, {
          'method': 'PATCH',
          'data':   propertyData
        });
      else
        promise = $.post('/properties/', propertyData);

      promise.done(function(data) {
        if (propertiesDict[data._id.$oid])
          triggerAlert('Property updated.');
        else
          triggerAlert('Property added.');

        updateProperty(data);

        data.$propertyLink.click();
      });
    });

    $('#sell-form').submit(function(e) {
      e.preventDefault();

      var propertyId = $sellPropertyId.val();
      var propertyData = { 'property': {} };

      if ($sellFormSubmit.val() === 'Sell House') {
        if ($sellFormSubmit.hasClass('disabled'))
          return;

        propertyData.property.for_sale = true;
        forSaleCount++;
      } else if ($sellFormSubmit.val() === 'Unsell House') {
        propertyData.property.for_sale = false;
        forSaleCount--;
      }

      $.ajax('/properties/' + propertyId, {
        'method': 'PATCH',
        'data':   propertyData
      })
      .done(function(data) {
        if (data.for_sale)
          triggerAlert('Property is now for sale.');
        else
          triggerAlert('Property is no longer for sale.');

        updateProperty(data);
        updateSellPane(data);
      });
    });

    /* Bootstrap popovers */
    $planNumber.popover({
      'content':  '1 = can sell only 1 property<br />' +
                  '2 = can sell only 2 properties<br />' +
                  '3 = can sell only 3 properties',
      'trigger':  'hover',
      'html':     true
    });

    /* Helper functions: alerts */
    function triggerAlert(message) {
      $alertMessage.html(message);

      $alertMessage.fadeIn();

      setTimeout(function() {
        $alertMessage.fadeOut();
      }, 3000);
    }

    /* Helper functions: tab-pane-specific */
    function updateStateForm() {
      var stateChosen = $stateInput.val();

      if (stateChosen) {
        $stateAll.show();
        $stateDependent.hide();

        $('#state-' + stateChosen).show();
      }
    }

    function clearPropertyInputs() {
      $stateInput.val(null);
      $('#property-id-edit').remove();

      for (var i = 0; i < textInputs.length; i++)
        $('#' + textInputs[i]).val(null);
      for (var i = 0; i < radioInputs.length; i++) {
        $('#no-'  + radioInputs[i]).prop('checked', false);
        $('#yes-' + radioInputs[i]).prop('checked', false);
      }
    }

    function updateSellPane(property) {
      function updateFunction() {
        var $missingFields      = $('#missing-fields');
        var $missingFieldsUl    = $('#missing-fields ul');

        var propertyFields      = propertyFieldsDict[property.state];
        var missingFieldsCount  = 0;
        var sellBtnMessage      = '';

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

        $sellPropertyId.val(property._id.$oid);

        if (missingFieldsCount) {
          $missingFields.show();

          sellBtnMessage =  '<li>Fill in all missing fields to sell this ' +
                            'property.</li>';
        }

        if (forSaleCount >= subscription.plan_number)
          sellBtnMessage += '<li>Upgrade your subscription to sell more ' +
                            'properties.</li>';

        $sellFormSubmit.popover('destroy');

        if (property.for_sale)
          $sellFormSubmit
          .val('Unsell House')
          .removeClass('disabled');
        else {
          $sellFormSubmit.val('Sell House');

          if (sellBtnMessage) {
            $sellFormSubmit.addClass('disabled');

            sellBtnMessage = '<ul>' + sellBtnMessage + '</ul>';

            $sellFormSubmit.popover({
              'content':  sellBtnMessage,
              'trigger':  'hover',
              'html':     true
            });
          }
          else
            $sellFormSubmit.removeClass('disabled');
        }
      }

      updateFunction();

      // Workaround to reset $sellFormSubmit.popover()
      setTimeout(function() {
        updateFunction();
      }, 500);
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
            id:   'property-id-edit',
            type: 'hidden',
            name: 'property[id]'
          })
          .val(selectedProperty._id.$oid));

          updateSellPane(selectedProperty);

          if ($alertMessage.css('display') === 'none')
            triggerAlert('Property selected.');
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
  };

  if (window.user) {
    window.user.subscription.properties =
                                      window.user.subscription.properties || [];

    window.dashboardInit();
  }
  else
    disableDashboard();

    function disableDashboard() {
      $('#subscribe-form input[type=submit]').addClass('disabled');

      $('#subscribe-form').submit(function(e) {
        e.preventDefault();
      });
    }
});
