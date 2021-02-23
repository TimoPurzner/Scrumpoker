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
  const [createRoomLoading, setCreateRoomLoading] = useState(false);
  const [entryRoomActive, setEntryRoomActive] = useState(false);
  const [errors, setErrors] = useState<String[]>([]);

  async function createRoom() {
    setCreateRoomLoading(true);
    api('estimation_rooms/', { method: 'POST' })
      .then((estimationRoom: EstimationRoom) => {
        history.push(scrumMasterRoute.replace(':id', estimationRoom._id));
      })
      .finally(() => setCreateRoomLoading(false));
  }

  async function joinRoom() {
    setJoinRoomLoading(true);
    api('users/', {
      method: 'POST',
      body: JSON.stringify({ user: { name: name, estimation_room: roomId } }),
    })
      .then((user: User) => {
        sessionStorage.setItem('user_id', user._id);
        setJoinRoomLoading(false);
        history.push(
          estimationViewRoute.replace(':id', user.estimation_room_id)
        );
      })
      .catch((error) => {
        if (error.estimation_room?.includes('estimation_room_empty')) {
          setErrors([
            ...errors,
            'Es konnte kein Raum unter dem Angegeben Code gefunden werden',
          ]);
        }
      })
      .finally(() => setJoinRoomLoading(false));
  }

  useEffect(() => {
    setEntryRoomActive(name !== '' && roomId !== '');
  }, [name, roomId]);

  return (
    <div className='login container'>
      <h1 className='login__header'>Scrumpoker</h1>
      <div className='login__grid'>
        <div className='login__user card'>
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
          <div className='login__errors'>
            {errors.map((error) => (
              <div key={error.toString()} className='error'>
                {error}
              </div>
            ))}
          </div>
        </div>
        <div className='card'>
          <h2>New Room</h2>
          <Button
            className='login__create'
            loading={createRoomLoading}
            onClick={createRoom}
          >
            Raum erstellen
          </Button>
        </div>
      </div>
    </div>
  );
}

export { route };
