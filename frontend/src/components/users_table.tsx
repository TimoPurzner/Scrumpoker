import { useState, useEffect } from 'react';
import api from '../api/http-client';
import { connectToRoom, onMessage } from '../api/ws-client';
import EstimationRoom from '../model/estimation-room';
import User from '../model/user';

type UsersTableProps = {
  room_id: string,
}

type WSType = {
  room: EstimationRoom,
  users: User[]
}

export default function UsersTable(props: UsersTableProps) {

    const id = props.room_id;
    const [users, setUsers] = useState<User[]>();
    const [error, setError] = useState(false);


    useEffect(() => {
      api(`estimation_rooms/${id}`)
      .then((estimationRoom: EstimationRoom) => {
        setUsers(estimationRoom.users);
      });
      const realTimeUpdates = async () => {
        const socket = await connectToRoom(id)
        onMessage(socket, (data: WSType) => {
          setUsers(data.users)
        });
        socket.onerror = () => {setError(true)}
      };
      realTimeUpdates();
        
    }, [id]);

  return (
    <div className='users-table'>
      <table className='users-table__table'>
        <thead>
            <tr>
                <th>Name</th>
                <th>Schätzung</th>
            </tr>
        </thead>
        <tbody>
        {users?.map(user => (
            <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user?.estimation}</td>
            </tr>
        ))}
        </tbody>
      </table>
    {error && 
      <div>
        Verbindung zum Server nicht möglich Daten werden nicht in echtzeit aktualisiert
      </div>
    }
    
    </div>
  );
}

