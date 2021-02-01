import { useState, useEffect } from 'react';
import EstimationRoom from '../../model/estimation-room';
import api from '../../api/http-client';
import { useParams } from 'react-router-dom';
import { connectToRoom, onMessage } from '../../api/ws-client';
import WSType from '../../model/ws-type';

const route = '/estimation-room/:id'
export default function EstimationView() {

    const { id } = useParams<Record<string, string>>();
    const [estimation, setEstimation] = useState('');
    const [currentStory, setCurrentStory] = useState('');
    const [estimationRoom, setEstimationRoom] = useState<EstimationRoom>();
    const [deliverState, setDeliverState] = useState('');

    useEffect(() => {
      api(`estimation_rooms/${id}`)
      .then((estimationRoom: EstimationRoom) => {
        setEstimationRoom(estimationRoom);
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
      <div>
        {currentStory}
      </div>

      Schätzung: <input type="text" value={estimation} onChange={(event)=> setEstimation(event.target.value)}/>
      <button 
        className={`estimation-view__button ${deliverState}`}
        onClick={sendEstimation}>
        Setzen
        </button>
    </div>
  );
}

export { route }

