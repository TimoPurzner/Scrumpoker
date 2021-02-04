import { useState, useEffect } from 'react';
import EstimationRoom from '../../model/estimation-room';
import api from '../../api/http-client';
import { useParams } from 'react-router-dom';
import { connectToRoom, onMessage } from '../../api/ws-client';
import WSType from '../../model/ws-type';
import './estimation-view.scss';

const route = '/estimation-room/:id'
export default function EstimationView() {

    const { id } = useParams<Record<string, string>>();
    const [estimation, setEstimation] = useState('');
    const [currentStory, setCurrentStory] = useState('');
    const [deliverState, setDeliverState] = useState('');

    useEffect(() => {
      
      api(`estimation_rooms/${id}`)
      .then((estimationRoom: EstimationRoom) => {
        setCurrentStory(estimationRoom.story);
      });
      const realTimeUpdates = async () => {
        const socket = await connectToRoom(id)
        onMessage(socket, (data: WSType) => {
          setCurrentStory(data.room.story);
        });
        socket.onerror = () => {console.log('Fehler bei der Websocket verbindung')}
      };
      realTimeUpdates();
    }, [id]);


    useEffect(() => {
      setDeliverState('')
    }, [estimation]);

    function sendEstimation() {
      const user_id = sessionStorage.getItem('user_id');
      api(`users/${user_id}`,
        {
          headers: {'Content-Type': 'application/json'},
          method: 'put',
          body: JSON.stringify({user: {estimation: estimation}})
        })
      .then(response => setDeliverState('success'))
      .catch(error => setDeliverState('error'));
    }

  return (
    <div className='estimation-view'>
      <h1 className='estimation-view__header'>Estimation Raum</h1>
      <p>Du bist aktuell im Raum 
        <span tooltip="Teile die ID, damit andere dem Raum beitreten können"> {id} </span>
        und wirst dem Scrummaster als TODO: angezeigt.
      </p>
      <h2>Aktuelle Story:</h2>
      <div className='estimation-view__story'>
        {currentStory}
      </div>
      <div className='estimation-view__estimate'>
        Schätzung: <input type="text" value={estimation} onChange={(event)=> setEstimation(event.target.value)}/>
        <button 
          className={`estimation-view__button ${deliverState}`}
          onClick={sendEstimation}>
          Setzen
          </button>
        </div>
    </div>
  );
}

export { route }

