require 'test_helper'

class UserTest < ActiveSupport::TestCase
  def setup
    User.destroy_all
    @user = User.new(username: 'Test User')
  end

  test 'user should be created' do
    assert_difference 'User.count', 1 do
      @user.save
    end
  end
end
