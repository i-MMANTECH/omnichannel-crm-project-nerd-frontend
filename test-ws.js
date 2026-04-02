const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8002/ws/chat/?uuid=16&type=company');
ws.on('open', () => { console.log('OPEN'); ws.close(); });
ws.on('error', (err) => console.error('ERROR:', err));
ws.on('close', (code, reason) => console.log('CLOSE:', code, reason.toString()));
