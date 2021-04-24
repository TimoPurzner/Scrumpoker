class EstimationRoomsController < ApplicationController
  before_action :set_estimation_room, only: [:show, :update, :destroy]

  # GET /estimation_rooms
  def index
    @estimation_rooms = EstimationRoom.all

    render json: @estimation_rooms
  end

  # GET /estimation_rooms/1
  def show
    render json: @estimation_room, include: :users
  end

  # POST /estimation_rooms
  def create
    @estimation_room = EstimationRoom.new({ story: '', status: 'voting' })
    if @estimation_room.save
      render json: @estimation_room, status: :created, location: @estimation_room
    else
      render json: @estimation_room.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /estimation_rooms/1
  def update
    if @estimation_room.update(estimation_room_params)
      @estimation_room.status = 'reset'
      EstimationRoomChannel.broadcast_to(@estimation_room, @estimation_room)
      @estimation_room.status = 'voting'
      if(params['story'])
        @estimation_room.users.each do |user|
          user.estimation = nil
          user.save
        end
      end
      EstimationRoomChannel.broadcast_to(@estimation_room, @estimation_room)
      EstimationRoomChannelUsers.broadcast_to(@estimation_room, @estimation_room.users)
      render json: @estimation_room
    else
      render json: @estimation_room.errors, status: :unprocessable_entity
    end
  end

  # DELETE /estimation_rooms/1
  def destroy
    @estimation_room.destroy
  end

  def join
    @estimation_room
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_estimation_room
      @estimation_room = EstimationRoom.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def estimation_room_params
      params.require(:estimation_room).permit(:story, :status)
    end
end
