import { useState, useEffect } from 'react';
import EstimationRoom from '../../model/estimation-room';
import { route as loginRoute } from '../login/login';
import api from '../../api/http-client';
import { useHistory, useParams } from 'react-router-dom';
import { connectToRoom, onMessage } from '../../api/ws-client';
import EstimationCardSet from '../../components/estimation-cards/estimation-card-set';
import './estimation-view.scss';

const route = '/estimation-room/:id';
export default function EstimationView() {
  const { id } = useParams<Record<string, string>>();
  const history = useHistory();
  const [currentStory, setCurrentStory] = useState('');
  const [estimation, setEstimation] = useState<string>('');
  const estimationOptions = ['1', '2', '3', '5', '8', '13', '20', '40', '?'];
  let windowCloseEventListener: EventListener;

  useEffect(() => {
    api(`estimation_rooms/${id}`)
      .then((estimationRoom: EstimationRoom) => {
        setCurrentStory(estimationRoom.story);
      })
      .catch((_) => history.push(loginRoute));
    const realTimeUpdates = async () => {
      const socket = await connectToRoom(id);
      onMessage(socket, (data: EstimationRoom) => {
        let newStory = data.story;
        setCurrentStory(newStory);
        if(data.status === 'reset') setEstimation('');
      });
      socket.onerror = () => {
        console.log('Fehler bei der Websocket verbindung');
      };
    };
    realTimeUpdates();
  }, [id, history]);

  useEffect(() => {
    if(!estimation) return;
    const user_id = sessionStorage.getItem('user_id');
    api(`users/${user_id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'put',
      body: JSON.stringify({ user: { estimation: estimation } }),
    });
  }, [estimation]);

  useEffect(() => {
    windowCloseEventListener = (ev: Event) => {
      const user_id = sessionStorage.getItem('user_id');
      sessionStorage.removeItem('user_id')
      api(`users/${user_id}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE',
      });
    };
    window.addEventListener('beforeunload', windowCloseEventListener);
    return function cleanup() {
      window.removeEventListener('beforeunload', windowCloseEventListener);
    };
  }, [])

  

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
        value={estimation}
        onChange={ (option: string) => {
          setEstimation(option);
        }}
        options={estimationOptions}
      />
    </div>
  );
}

export { route };
