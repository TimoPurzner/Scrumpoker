class EstimationRoomChannel < ApplicationCable::Channel

    def subscribed
        room = EstimationRoom.find(params[:id])
        stream_for room
    end

end
