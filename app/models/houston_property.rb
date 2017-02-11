class HoustonProperty < Property
  field :pool, type: Mongoid::Boolean
  field :garage, type: Mongoid::Boolean
end
