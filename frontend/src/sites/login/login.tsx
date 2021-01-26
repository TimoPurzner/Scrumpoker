import './login.scss'
import { useState } from 'react';
import { useHistory } from "react-router-dom";
import api from '../../api/http-client';
import {route as scrumMasterRoute} from '../scrum_master_view/scrum_master_view';
import {route as estimationViewRoute} from '../estimation-room/estimation-view';
import User from '../../model/user';
import EstimationRoom from '../../model/estimation-room';

const route = '/'
export default function Login() {

    const history = useHistory();
    const [name, setName] = useState('');
    const [roomId, setRommId] = useState('');

    async function createRoom() {
        api('estimation_rooms/', {method: 'POST'})
        .then((estimationRoom: EstimationRoom) => {
            history.push(scrumMasterRoute.replace(':id', estimationRoom._id));
        }).catch()
        
    }

    async function joinRoom() {
        const user: User  = await (await api('users/', 
            {
                method: 'POST',
                body: JSON.stringify({user: {name: name, estimation_room: roomId}})
            }));
        sessionStorage.setItem('user_id', user._id);
        console.log(user);
        history.push(estimationViewRoute.replace(':id', user.estimation_room_id));
    }

    return (
    <div>
        <div>
            Login
            Name: <input type='text' value={name} onChange={ (event) => setName(event.target.value)} />
            Raum ID: <input type='text' value={roomId} onChange={ (event) => setRommId(event.target.value)} />
            <button onClick={joinRoom}>Raum beitreten</button>
        </div>
        <div>
            ORDER
        </div>
        <div>
            <button onClick={createRoom}>Raum erstellen</button>
        </div>
    </div>
    );
    }

export { route }