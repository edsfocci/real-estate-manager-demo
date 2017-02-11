class Subscription
  include Mongoid::Document
  field :plan_number, type: Integer
  embedded_in :user
  embeds_many :properties
  validates :plan_number, numericality: {
    greater_than_or_equal_to: 1, less_than_or_equal_to: 3
  }
end
