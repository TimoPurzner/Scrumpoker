export {connectToRoom, onMessage}

const BASE_URL = process.env["NODE_ENV"] === 'production' ? 'wss://scrumpoker-rails.herokuapp.com/' : 'ws://localhost:3000';

function connectToRoom(id: string) {
    return new Promise<WebSocket>(function(resolve, reject) {
        const socket = new WebSocket(`${BASE_URL}/cable`);
        socket.onopen = function() {
            const msg = {
                command: 'subscribe',
                identifier: JSON.stringify({
                    id: id,
                    channel: 'EstimationRoomChannel'
                }),
            };
            socket.send(JSON.stringify(msg));
            resolve(socket);
        };
        socket.onerror = function(err) {
            reject(err);
        };

    });
}

export function connectToRoomUsers(id: string) {
    return new Promise<WebSocket>(function(resolve, reject) {
        const socket = new WebSocket(`${BASE_URL}/cable`);
        socket.onopen = function() {
            const msg = {
                command: 'subscribe',
                identifier: JSON.stringify({
                    id: id,
                    channel: 'EstimationRoomChannelUsers'
                }),
            };
            socket.send(JSON.stringify(msg));
            resolve(socket);
        };
        socket.onerror = function(err) {
            reject(err);
        };

    });
}

function onMessage(socket: WebSocket, cb: any) {
        socket.onmessage = function(event) {
            const response = event.data;
            const msg = JSON.parse(response);
            if (msg.type === 'ping' || msg.type === 'welcome' || msg.type === 'confirm_subscription') {
                return;
            } else {
                cb(msg.message);
            }
        };
}