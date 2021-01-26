class EstimationRoom
  
  include Mongoid::Document
  include Mongoid::Timestamps

  field :story, type: String
  field :status, type: String
  

  has_many :users
  
end
