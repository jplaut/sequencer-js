class ProjectsController < ApplicationController
  def create
    project = Project.new(
      name: params[:project][:name], 
      tempo: params[:project][:tempo],
      instruments: params[:project][:instruments]
    )

    project.save
    params[:project][:id] = project.id
    render json: params[:project]
  end

  def update
    project = Project.find(params[:id])
    project.attributes = params[:project]
    project.save

    render json: params[:project]
  end
end