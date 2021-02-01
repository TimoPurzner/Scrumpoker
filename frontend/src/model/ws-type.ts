import EstimationRoom from "./estimation-room";
import User from "./user";

export default interface WSType {
    room: EstimationRoom,
    users: User[]
};