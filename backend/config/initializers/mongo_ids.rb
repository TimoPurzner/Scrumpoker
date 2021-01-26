module Mongoid
  module Document
    def as_json(options = {})
      attrs = super(options)
      id = { _id: attrs['_id'].to_s }
      id.merge(attrs)
    end
  end
end

module BSON
  class ObjectId
    alias to_json to_s
    alias as_json to_s
  end
end
