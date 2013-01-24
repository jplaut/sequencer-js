class HomeController < ApplicationController
  layout "home"

  def index
    @name = "Jon"
  end
end
