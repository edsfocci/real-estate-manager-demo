class PropertiesController < ApplicationController
  def create
    property_class = {
      'DallasProperty'  => DallasProperty,
      'AustinProperty'  => AustinProperty,
      'HoustonProperty' => HoustonProperty
    }[params[:property][:state]]
    current_user.subscription.properties.push property_class.new(
                                                                property_params)

    @property = current_user.subscription.properties.last
  end

  def update
    @property = current_user.subscription.properties.find params[:id]
    @property.update property_params
  end

  private

    def property_params
      params.require(:property).permit  :address, :roof_type, :bedrooms,
                              :bathrooms, :dining_area, :kitchen, :pool, :garage
    end
end
