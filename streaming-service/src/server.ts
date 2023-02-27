import net from 'net';
import { WebSocket, WebSocketServer } from 'ws';
const fs = require('fs');
let incident_timestamps = [0, 0, 0, 0];

const TCP_PORT = parseInt(process.env.TCP_PORT || '12000', 10);

const tcpServer = net.createServer();
const websocketServer = new WebSocketServer({ port: 8080 });

tcpServer.on('connection', (socket) => {
    console.log('TCP client connected');
    socket.on('data', (msg) => {
        // HINT: what happens if the JSON in the received message is formatted incorrectly?
        // HINT: see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch

        try {
            let currJSON = JSON.parse(msg.toString());
            console.log(currJSON);
            if (currJSON.battery_temperature > 80 || currJSON.battery_temperature < 20) {
                incident_timestamps.shift();
                incident_timestamps[3] = currJSON.timestamp;
                if (incident_timestamps[3] - incident_timestamps[0] < 5000) {
                    fs.appendFileSync('./incidents.log', currJSON.timestamp + "\n");
                }
            }
        } catch(e) {
            console.error("error: failed to parse message");
        };

        websocketServer.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(msg.toString());
            }
          });
    });

    socket.on('end', () => {
        console.log('Closing connection with the TCP client');
    });
    
    socket.on('error', (err) => {
        console.log('TCP client error: ', err);
    });
});

websocketServer.on('listening', () => console.log('Websocket server started'));

websocketServer.on('connection', async (ws: WebSocket) => {
    console.log('Frontend websocket client connected to websocket server');
    ws.on('error', console.error);  
});

tcpServer.listen(TCP_PORT, () => {
    console.log(`TCP server listening on port ${TCP_PORT}`);
});


