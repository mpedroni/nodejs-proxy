import net from 'net';

const port = 3000;
const hostname = '127.0.0.1';

const proxy = net.createServer((client) => {
  client.once('data', (data) => {
    const message = data.toString().split('\r\n\r\n')[0];
    const method = message.split('\r\n')[0].split(' ')[0];
    const version = message.split('\r\n')[0].split('HTTP/')[1];
    const isTLS = method === 'CONNECT';
    const port = isTLS ? 443 : 80;
    const host = message.split('Host: ')[1].split('\r\n')[0].split(':')[0];

    if (
      message.includes('www.google.com:443') ||
      message.includes('facebook')
    ) {
      client.write(
        `HTTP/${version} 401 Unauthorized\r\nProxy-Server: nodejs-proxy\r\n\r\n`,
      );
      client.end();
      return;
    }

    const server = net.connect({
      port,
      host,
    });

    console.log(message, '\n');

    client.pipe(server);
    server.pipe(client);

    if (isTLS) {
      client.write(
        `HTTP/${version} 200 OK\r\nProxy-Server: nodejs-proxy\r\n\r\n`,
      );
    } else server.write(data);

    client.on('error', (err) => {
      console.error('[Client] ', err);
    });

    server.on('error', (err) => {
      console.error('[Server] ', err);
    });
  });
});

proxy.on('error', (err) => {
  console.error('[Proxy] ', err);
});

proxy.listen(port, hostname);
