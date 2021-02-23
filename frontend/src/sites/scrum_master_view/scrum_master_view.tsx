import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EstimationRoom from '../../model/estimation-room';
import api from '../../api/http-client';
import UsersTable from '../../components/users_table/users_table';

import './scrum_master_view.scss';

const route = '/scrum-master-view/:id';
export default function ScrumMasterView() {
  const { id } = useParams<Record<string, string>>();
  const [story, setStory] = useState('');
  const [storyState, setStoryState] = useState('');
  const [estimationRoom, setEtimationRoom] = useState<EstimationRoom>();
  const tooltip = { tooltip: 'Klick to copy' };

  useEffect(() => {
    api(`estimation_rooms/${id}`).then((estimationRoom: EstimationRoom) => {
      setStory(estimationRoom.story);
      setEtimationRoom(estimationRoom);
    });
  }, [id]);

  function updateStory() {
    api(`estimation_rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ story: story }),
    })
      .then((_) => setStoryState('success'))
      .catch((_) => setStoryState('error'))
      .finally(() => {
        setTimeout(() => {
          setStoryState('');
        }, 1000);
      });
  }

  function roomIdToClickboard() {
    var tempInput = document.createElement('input');
    tempInput.setAttribute(
      'style',
      'position: absolute; left: -1000px; top: -1000px'
    );
    tempInput.setAttribute('value', estimationRoom?._id ?? id);
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  }

  return (
    <div className='scrum-master container'>
      <h1 className='scrum-master__header'>SCRUM-Estimation Übersicht</h1>
      <div className='card'>
        <div className='scrum-master__share'>
          Code zum teilen für Teilnehmer:
          <span
            id='scrum-master-room-id'
            {...tooltip}
            className='scrum-master__share__code'
            onClick={roomIdToClickboard}
          >
            {estimationRoom?._id}
          </span>
        </div>
        <div className='scrum-master__story-input'>
          <textarea
            className='scrum-master__story-input__textarea'
            placeholder='Beschreibe die zuschätzende Story kurz'
            onChange={(event) => setStory(event.target.value)}
            value={story}
          />
          <button className={`big ${storyState}`} onClick={updateStory}>
            Setze Story
          </button>
        </div>
      </div>
      <div className='scrum-master__users'>
        <h2 className='scrum-master__users__header'>Teilnehmer:</h2>
        <UsersTable room_id={id} />
      </div>
    </div>
  );
}

export { route };
