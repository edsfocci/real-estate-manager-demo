'use strict';

$(function() {
  var $authModal            = $('#auth-modal');
  var $authModalItems       = $('.auth-modal-item');
  var $authModalLogin       = $('.log-in');
  var $authModalSignup      = $('.sign-up');
  var $authModalForgotPw    = $('.forgot-password');
  var $authModalLoginBtn    = $('.login-btn-modal');
  var $authModalSignupBtn   = $('.signup-btn-modal');
  var $authModalForgotPwBtn = $('.forgot-password-btn-modal');

  updateAuthenticationNav();

  $('.auth-nav-btn').click(function(e) {
    e.preventDefault();

    $authModal.modal('show');
  });

  $authModalLoginBtn.click(function(e) {
    e.preventDefault();

    $authModalItems.hide();
    $authModalLogin.show();
  });

  $authModalSignupBtn.click(function(e) {
    e.preventDefault();

    $authModalItems.hide();
    $authModalSignup.show();
  });

  $authModalForgotPwBtn.click(function(e) {
    e.preventDefault();

    $authModalItems.hide();
    $authModalForgotPw.show();
  });


  $('#log-in').submit(function(e) {
    e.preventDefault();

    var user = {
      'email':    $('#user_email_login').val(),
      'password': $('#user_password_login').val()
    }

    if ($('#user_remember_me_login').prop('checked'))
      user.remember_me = '1';
    else
      user.remember_me = '0';

    user = { 'user': user };

    $.post('/users/sign_in', user, 'json')
    .done(signInUser);
  });

  $('#sign-up').submit(function(e) {
    e.preventDefault();

    var data = {
      'user': {
        'email':                  $('#user_email_signup').val(),
        'password':               $('#user_password_signup').val(),
        'password_confirmation':  $('#user_password_confirmation_signup').val()
      },
      'subscription': {
        'plan_number':            $('#sign-up .plan_number').val()
      }
    };

    $.post('/users', data)
    .done(signInUser);
  });

  /* Bootstrap popovers */
  $('#sign-up .plan_number').popover({
    'content':  '1 = can sell only 1 property<br />' +
                '2 = can sell only 2 properties<br />' +
                '3 = can sell only 3 properties',
    'trigger':  'hover',
    'html':     true
  });

  $('#forgot-password').submit(function(e) {
    e.preventDefault();
  });

  function updateAuthenticationNav() {
    $('.auth-nav').hide();

    if (window.user) {
      $('#current_user_email').html(window.user.email);
      $('.current_user').show();
    } else {
      $('.login-signup').show();
    }
  }

  function signInUser(user) {
    location.reload();
  }
});
