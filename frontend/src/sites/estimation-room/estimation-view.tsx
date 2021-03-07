import { useState, useEffect, useRef } from 'react';
import EstimationRoom from '../../model/estimation-room';
import { route as loginRoute } from '../login/login';
import api from '../../api/http-client';
import { useHistory, useParams } from 'react-router-dom';
import { connectToRoom, onMessage } from '../../api/ws-client';
import WSType from '../../model/ws-type';
import EstimationCardSet from '../../components/estimation-cards/estimation-card-set';
import './estimation-view.scss';

const route = '/estimation-room/:id';
export default function EstimationView() {
  const { id } = useParams<Record<string, string>>();
  const history = useHistory();
  const estimationCardForm = useRef<any>(null);
  const [currentStory, setCurrentStory] = useState('');
  const estimationOptions = ['1', '2', '3', '5', '8', '13', '20', '40', '?'];

  useEffect(() => {
    api(`estimation_rooms/${id}`)
      .then((estimationRoom: EstimationRoom) => {
        setCurrentStory(estimationRoom.story);
      })
      .catch((_) => history.push(loginRoute));
    realTimeUpdates();
  }, [id, history]);

  const realTimeUpdates = async () => {
      const socket = await connectToRoom(id);
      onMessage(socket, (data: WSType) => {
        let newStory = data.room.story;
        estimationCardForm.current.resetForm();
        setCurrentStory(newStory);
      });
      socket.onerror = () => {
        console.log('Fehler bei der Websocket verbindung');
      };
    };

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
      </div>
      <EstimationCardSet
        ref={estimationCardForm}
        onChange={ (option: string) => {sendEstimation(option)}}
        options={estimationOptions}
      />
    </div>
  );
}

export { route };
