require 'test_helper'

class UsersSignupTest < ActionDispatch::IntegrationTest
  test 'invalid signup information' do
    get root_path
    assert_no_difference 'User.count' do
      post user_registration_path, params: {
        user: {
          email:                  'user@invalid',
          password:               'foo',
          password_confirmation:  'bar',
        },
        subscription: {
          plan_number:            1
        }
      }
    end
  end
end
