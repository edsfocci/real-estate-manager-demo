'use strict';


$(function() {
  showStateForm();

  $('#state').change(function() {
    showStateForm();
  });

  // $();

  function showStateForm() {
    var stateChosen = $('#state').val();

    if (stateChosen) {
      $('.state-all').show();
      $('.state-dependent').hide();

      $('#state-' + stateChosen).show();
    }
  }
});
