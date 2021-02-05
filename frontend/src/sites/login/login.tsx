import './login.scss';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../api/http-client';
import { route as scrumMasterRoute } from '../scrum_master_view/scrum_master_view';
import { route as estimationViewRoute } from '../estimation-room/estimation-view';
import User from '../../model/user';
import EstimationRoom from '../../model/estimation-room';
import Button from '../../components/button/button';

const route = '/';
export default function Login() {
  const history = useHistory();
  const [name, setName] = useState('');
  const [roomId, setRommId] = useState('');
  const [joinRoomLoading, setJoinRoomLoading] = useState(false);
  const [entryRoomActive, setEntryRoomActive] = useState(false);

  async function createRoom() {
    api('estimation_rooms/', { method: 'POST' })
      .then((estimationRoom: EstimationRoom) => {
        history.push(scrumMasterRoute.replace(':id', estimationRoom._id));
      })
      .catch();
  }

  async function joinRoom() {
    setJoinRoomLoading(true);
    const user: User = await api('users/', {
      method: 'POST',
      body: JSON.stringify({ user: { name: name, estimation_room: roomId } }),
    });
    sessionStorage.setItem('user_id', user._id);
    console.log(user);
    setJoinRoomLoading(false);
    history.push(estimationViewRoute.replace(':id', user.estimation_room_id));
  }

  useEffect(() => {
    setEntryRoomActive(name !== '' && roomId !== '');
  }, [name, roomId]);

  return (
    <div className='login'>
      <h1 className='login__header'>Scrumpoker</h1>
      <div className='login__user'>
        <h2 className='login__user__header'>Login</h2>
        <form className='login__form'>
          <label htmlFor='name'>Name:</label>
          <input
            id='name'
            type='text'
            placeholder='Anzeigename'
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <label htmlFor='room-id'>Raum ID:</label>
          <input
            id='room-id'
            type='text'
            placeholder='Estimation Raum'
            value={roomId}
            onChange={(event) => setRommId(event.target.value)}
          />
          <Button
            className='login__form__button'
            onClick={joinRoom}
            loading={joinRoomLoading}
            disabled={!entryRoomActive}
          >
            Raum beitreten
          </Button>
        </form>
      </div>
      <h2>ODER</h2>
      <Button className='login__create' onClick={createRoom}>
        Raum erstellen
      </Button>
    </div>
  );
}

export { route };
