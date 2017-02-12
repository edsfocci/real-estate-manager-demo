json.(@property, :id, :for_sale, :address, :roof_type)

case @property._type
when 'DallasProperty'
  json.(@property, :bedrooms, :bathrooms)
when 'AustinProperty'
  json.(@property, :dining_area, :kitchen)
when 'HoustonProperty'
  json.(@property, :pool, :garage)
end
