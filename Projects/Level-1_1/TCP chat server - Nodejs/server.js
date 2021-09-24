const net = require('net');

const server = net.createServer();

let clients = {}

let clientCount = 0;

server.on('connection', connection => {
    let clientName;
    let message = [];

    function broadcast(msg) {
        for (let client in clients) {
            if (clients[client] !== connection) {
                clients[client].write(msg);
            }
        }
    }
    
    connection.write(`Please enter a room name\r\n`);

    connection.setEncoding('utf-8');

    connection.on('data', data => {
        message.push(data);

        // proceed only if the 'enter' key is pressed
        if (data === '\r\n') {
            let clientInput = message.join('').replace('\r\n','');

            if (!clientName) {
                if (clients[clientInput]) {
                    connection.write(' - Name is taken, try another name\r\n');

                    message = [];
                    return;
                } else {
                    clientName = clientInput;

                    clientCount++;

                    clients[clientInput] = connection;

                    connection.write(` - Welcome to the chatbox, There are ${clientCount} active users`);

                    broadcast(`- ${clientName} has joined the room\r\n`);
                    
                    message = [];
                }
            } else {
                broadcast(`> ${clientName} : ${clientInput}\r\n`);
                message = [];
            }
        }
    });

    connection.on('close', () => {
        delete clients[clientName];

        clientCount--;

        broadcast(`- ${clientName} has left the room\r\n Active users: ${clientCount}\r\n`);
    });

    connection.on('error', (error) => {
        connection.write(`Error : ${error}`);
    });
});

server.on('close', () => {
    console.log('Server disconnected');
});

server.on('error', (error) => {
    console.log(`Error : ${error}`);
});

server.listen(4000);