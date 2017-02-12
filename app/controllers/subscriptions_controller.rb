class SubscriptionsController < ApplicationController
  def update
    @subscription = current_user.subscription
    @subscription.update subscription_params
  end

  private

    def subscription_params
      params.require(:subscription).permit  :plan_number
    end
end
