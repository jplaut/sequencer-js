class Project
  include Mongoid::Document

  field :name, type: String
  field :instruments, type: Hash
end