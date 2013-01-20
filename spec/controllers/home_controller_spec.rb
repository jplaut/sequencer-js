require 'spec_helper'

describe HomeController, type: :controller do
  describe "#index" do
    render_views

    it "should work" do
      get :index
      response.should be_success
    end
  end
end
