import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EstimationRoom from '../../model/estimation-room';
import api from '../../api/http-client';
import UsersTable from '../../components/users_table';

import './scrum_master_view.scss'


const route = '/scrum-master-view/:id'
export default function ScrumMasterView() {

    const { id } = useParams<Record<string, string>>();
    const [story, setStory] = useState('');
    const [estimationRoom, setEtimationRoom] = useState<EstimationRoom>();
    const tooltip = {tooltip: 'Klick to copy'};

    useEffect(() => {
        api(`estimation_rooms/${id}`)
        .then((estimationRoom: EstimationRoom) => {
            setStory(estimationRoom.story);
            setEtimationRoom(estimationRoom);
            
        });
        
    }, [id]);

    function roomIdToClickboard() {
        var tempInput = document.createElement("input");
        tempInput.setAttribute('style', 'position: absolute; left: -1000px; top: -1000px')
        tempInput.setAttribute('value', estimationRoom?._id ?? id)
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
    }

    return (
    <div className='scrum-master'>
        <h1 className='scrum-master__header'>
            SCRUM-Estimation Übersicht
        </h1>
        <div className='scrum-master__share'>
            Code zum teilen für Teilnehmer:
            <span id='scrum-master-room-id' {...tooltip} className='scrum-master__share__code' onClick={roomIdToClickboard}>
                {estimationRoom?._id}
            </span>
        </div>
        <div className='scrum-master__story-input'>
            <textarea contentEditable='true'
                className='scrum-master__story-input__textarea'
                placeholder='Beschreibe die zuschätzende Story kurz'
                onChange={(event) => setStory(event.target.value)} 
                value={story}
            />
            <button className='scrum-master__story-input__submit big'>Setze Story</button>
        </div>
        <div className='scrum-master__users'>
            <div className='scrum-master__users__header'>
                Teilnehmer:
            </div>
            <UsersTable room_id={id} />
        </div>
    </div>
    );
}

export { route }

