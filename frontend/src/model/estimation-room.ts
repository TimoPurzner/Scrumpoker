import User from './user';
export default interface EstimationRoom {
  _id: string;
  status: string;
  story: string;
  users: User[];
  created_at: string;
  updated_at: string;
}
