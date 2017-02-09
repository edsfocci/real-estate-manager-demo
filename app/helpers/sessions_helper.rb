module SessionsHelper
  # Makes the Example User the current user.
  def current_user
    @current_user ||= User.first
  end
end
