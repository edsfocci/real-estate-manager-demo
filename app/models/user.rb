class User
  include Mongoid::Document
  field :username, type: String
  embeds_one :subscription
  validates :username, presence: true
end
