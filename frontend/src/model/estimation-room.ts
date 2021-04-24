import User from './user';
export default interface EstimationRoom {
  _id: string;
  status: 'voting' | 'reset';
  story: string;
  users: User[];
  created_at: string;
  updated_at: string;
}
