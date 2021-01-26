class User

  include Mongoid::Document
  include Mongoid::Timestamps
  field :name, type: String
  field :estimation, type: String

  belongs_to :estimation_room

end
