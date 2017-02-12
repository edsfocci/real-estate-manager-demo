module SessionsHelper
  # Makes the Example User the current user.
  def current_user
    @current_user = @current_user || User.first || create_user
  end

  def create_user
    user = User.create(username: 'Example User')
    user.subscription = Subscription.new(plan_number: 1)

    user.subscription.properties.push(
      DallasProperty.new( address: '123 Main Street', roof_type: 'simple',
                          bedrooms: 3, bathrooms: 2, for_sale: true))
    user.subscription.properties.push(
      AustinProperty.new( address: '234 Far Gallant', dining_area: true,
                          kitchen: false))
    user.subscription.properties.push(
      HoustonProperty.new( address: '333 Sample Address'))

    return user
  end
end
