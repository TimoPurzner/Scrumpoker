require 'test_helper'

class EstimationRoomsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @estimation_room = EstimationRoom.new()
    @estimation_room.save
  end

  test "should get index" do
    get estimation_rooms_url, as: :json
    assert_response :success
  end

  test "should create estimation_room and set default status to voting" do
    assert_difference('EstimationRoom.count') do
      post estimation_rooms_url, as: :json
    end

    body = JSON.parse(response.body)
    assert(body["_status"] == "voting")

    assert_response 201
  end

  test "should show estimation_room" do
    @estimation_room.users << User.new(name: 'Lucy')
    get estimation_room_url(@estimation_room), as: :json
    body = JSON.parse(response.body)
    assert_equal( "Lucy", body["users"][0]["name"])
    assert_response :success
  end

  test "should update estimation_room" do
    patch estimation_room_url(@estimation_room), params: { estimation_room: { story: 'Estimate this!' } }, as: :json
    assert(JSON.parse(response.body)["story"] == 'Estimate this!')
    assert_response 200
  end

  test "should destroy estimation_room" do
    assert_difference('EstimationRoom.count', -1) do
      delete estimation_room_url(@estimation_room), as: :json
    end
    assert_response 204
  end
end
