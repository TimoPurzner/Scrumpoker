import { useState, useEffect } from 'react';
import api from '../../api/http-client';
import { connectToRoomUsers, onMessage } from '../../api/ws-client';
import EstimationRoom from '../../model/estimation-room';
import User from '../../model/user';

import './users_table.scss';

type UsersTableProps = {
  room_id: string;
};

export default function UsersTable(props: UsersTableProps) {
  const id = props.room_id;
  const [users, setUsers] = useState<User[]>();
  const [error, setError] = useState(false);

  useEffect(() => {
    api(`estimation_rooms/${id}`).then((estimationRoom: EstimationRoom) => {
      setUsers(estimationRoom.users);
    });
    const realTimeUpdates = async () => {
      const socket = await connectToRoomUsers(id);
      onMessage(socket, (data: User[]) => {
        setUsers(data);
      });
      socket.onerror = () => {
        setError(true);
      };
    };
    realTimeUpdates();
  }, [id]);

  return (
    <div className='users-table'>
      <table className='users-table__table'>
        <thead className='users-table__table__head'>
          <tr>
            <th className='users-table__table__th'>Name</th>
            <th className='users-table__table__th'>Schätzung</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user?.estimation}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && (
        <div className='error'>
          Verbindung zum Server nicht möglich Daten werden nicht aktualisiert
        </div>
      )}
    </div>
  );
}
