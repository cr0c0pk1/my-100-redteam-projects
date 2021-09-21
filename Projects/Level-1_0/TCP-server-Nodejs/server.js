const net = require('net');

const server = net.createServer();

const handleConnection = (conn) => {
    const remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
    console.log(`new client connection from ${remoteAddress}`);

    conn.on('data', (data) => {
        console.log(`connection data from ${remoteAddress}: ${data}`);
        conn.write(data);
    });
    
    conn.once('close', () => {
        console.log(`connection from ${remoteAddress} closed`);
    });

    conn.on('error', (err) => {
        console.log(`connection ${remoteAddress} error: ${err.message}`);
    });
};

server.on('connection', handleConnection);

server.listen(9000, '0.0.0.0', () => {
    console.log('server listening to %j', server.address());
});