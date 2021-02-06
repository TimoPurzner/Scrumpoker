class User

  include Mongoid::Document
  include Mongoid::Timestamps
  field :name, type: String
  field :estimation, type: String

  belongs_to :estimation_room

  validates_associated :estimation_room, message: 'estimation_room_does_not_exist'
  validates_presence_of :estimation_room, message: 'estimation_room_empty'

end
