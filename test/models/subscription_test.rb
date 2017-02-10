require 'test_helper'

class SubscriptionTest < ActiveSupport::TestCase
  def setup
    User.destroy_all
    @user = User.create(username: 'Test User')
  end

  test 'valid plan number' do
    (1..3).each do |num|
      @user.subscription = Subscription.new(plan_number: num)
      assert @user.subscription.save, "plan_number #{num} should be valid"
    end
  end

  test 'invalid plan number' do
    [-1, 0, 4].to_set.each do |num|
      @user.subscription = Subscription.new(plan_number: num)
      assert_not @user.subscription.save,
                                      "plan_number #{num} should not be valid"
    end
  end
end
