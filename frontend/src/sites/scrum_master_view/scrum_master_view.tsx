import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EstimationRoom from '../../model/estimation-room';
import api from '../../api/http-client';
import UsersTable from '../../components/users_table';


const route = '/scrum-master-view/:id'
export default function ScrumMasterView() {

    const { id } = useParams<Record<string, string>>();
    const [story, setStory] = useState('');
    const [estimationRoom, setEtimationRoom] = useState<EstimationRoom>();

    useEffect(() => {
        api(`estimation_rooms/${id}`)
        .then((estimationRoom: EstimationRoom) => {
            setStory(estimationRoom.story);
            setEtimationRoom(estimationRoom);
            
        });
        
    }, [id]);

  return (
    <div className='scrum-master'>
        <div className="scrum-master__code">
            Raum beitreten: 
            <span className='scrum-master__code__text'> {estimationRoom?._id} </span>
        </div>
        <div className='scrum-master__input'>
            <textarea onChange={(event) => setStory(event.target.value)} value={story} />
        </div>
        <div className='scrum-master__users'>
            <div className='scrum-master__users_header'>
                Schätzer:
            </div>
        
            <UsersTable room_id={id} />
        
        </div>
    </div>
  );
}

export { route }

