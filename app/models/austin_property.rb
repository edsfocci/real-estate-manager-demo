class AustinProperty < Property
  field :dining_area, type: Mongoid::Boolean
  field :kitchen, type: Mongoid::Boolean
end
