class Property
  include Mongoid::Document
  field :address, type: String
  field :roof_type, type: String
  embedded_in :subscription
end
