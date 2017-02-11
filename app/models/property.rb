class Property
  include Mongoid::Document
  field :address,   type: String
  field :roof_type, type: String
  field :for_sale,  type: Mongoid::Boolean
  embedded_in :subscription
end
