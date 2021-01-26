require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @estimation_room = EstimationRoom.new
    @estimation_room.save
    @user = User.new(estimation_room: @estimation_room.id)
    @user.save
  end

  test "should get index" do
    get users_url, as: :json
    assert_response :success
  end

  test "should create user" do
    assert_difference('User.count', 1) do
      post users_url,
        params: {
          user:
            {
              name: 'Ruby', 
              estimation_room: @estimation_room.id.to_s
            }
          }, 
        as: :json
    end

    assert_equal( 'Ruby', JSON.parse(response.body)['name'])
    assert_response 201
  end

  test "should show user" do
    get user_url(@user), as: :json
    assert_response :success
  end

  test "should update user" do
    patch user_url(@user), params: { user: { estimation: '5' } }, as: :json
    assert_equal( '5', JSON.parse(response.body)['estimation'])
    assert_response 200
  end

  test "should destroy user" do
    assert_difference('User.count', -1) do
      delete user_url(@user), as: :json
    end

    assert_response 204
  end
end
