import { useState, useEffect, useRef } from 'react';
import EstimationRoom from '../../model/estimation-room';
import { route as loginRoute } from '../login/login';
import api from '../../api/http-client';
import { useHistory, useParams } from 'react-router-dom';
import { connectToRoom, onMessage } from '../../api/ws-client';
import WSType from '../../model/ws-type';
import './estimation-view.scss';

const route = '/estimation-room/:id';
export default function EstimationView() {
  const { id } = useParams<Record<string, string>>();
  const history = useHistory();
  const [currentStory, setCurrentStory] = useState('');
  const estimationForm = useRef(null);
  const estimationOptions = ['1', '2', '3', '5', '8', '13', '20', '40', '?'];

  useEffect(() => {
    const currentForm = estimationForm.current;
    if (currentForm) {
      (currentForm as HTMLFormElement).reset();
    }
  }, [currentStory]);

  useEffect(() => {
    api(`estimation_rooms/${id}`)
      .then((estimationRoom: EstimationRoom) => {
        setCurrentStory(estimationRoom.story);
      })
      .catch((_) => history.push(loginRoute));
    const realTimeUpdates = async () => {
      const socket = await connectToRoom(id);
      onMessage(socket, (data: WSType) => setCurrentStory(data.room.story));
      socket.onerror = () => {
        console.log('Fehler bei der Websocket verbindung');
      };
    };
    realTimeUpdates();
  }, [id, history]);

  function sendEstimation(estimation: string) {
    const user_id = sessionStorage.getItem('user_id');
    api(`users/${user_id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'put',
      body: JSON.stringify({ user: { estimation: estimation } }),
    });
  }

  return (
    <div className='estimation-view container'>
      <h1 className='estimation-view__header'>Estimation Raum</h1>
      <div className='card'>
        <p>
          Raum:
          <span tooltip='Teile die ID, damit andere dem Raum beitreten können'>
            {id}
          </span>
        </p>
        <h2>Aktuelle Story:</h2>
        <div className='estimation-view__story'>{currentStory}</div>
        <h3 className='estimation-view__estimate'>Meine Schätzung</h3>
      </div>
      <form ref={estimationForm}>
        <div className='estimation-view__cards'>
          {estimationOptions.map((estimationOption, index) => (
            <span key={index} className='poker-card'>
              <input
                id={index.toString()}
                className='poker-card__input'
                type='radio'
                name='estimation'
                value={estimationOption}
                onChange={() => sendEstimation(estimationOption)}
              />
              <label className='poker-card__label' htmlFor={index.toString()}>
                {estimationOption}
              </label>
            </span>
          ))}
        </div>
      </form>
    </div>
  );
}

export { route };
