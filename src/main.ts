import net from 'net';

const port = 3000;
const hostname = '127.0.0.1';

const blackList = ['google.com', 'facebook'];

function parseHttpMessage(data: Buffer) {
  const message = data.toString().split('\r\n\r\n')[0];

  const method = message.split('\r\n')[0].split(' ')[0];
  const httpVersion = message.split('\r\n')[0].split('HTTP/')[1];
  const isTLS = method === 'CONNECT';
  const port = isTLS ? 443 : 80;
  const host = message.split('Host: ')[1].split('\r\n')[0].split(':')[0];

  return {
    method,
    httpVersion,
    isTLS,
    port,
    host,
    message,
  };
}

function isHostBlocked(host: string) {
  return blackList.some((h) => host.includes(h));
}

type HttpStatusCode = 200 | 403;

function createHttpResponse(code: HttpStatusCode, httpVersion = '1.1') {
  const codes: Record<HttpStatusCode, string> = {
    200: 'OK',
    403: 'Forbidden',
  };

  const headers = [
    `HTTP/${httpVersion} ${code} ${codes[code]}`,
    `Proxy-Server: nodejs-proxy`,
    '\r\n',
  ];

  const response = headers.join('\r\n');
  return response;
}

const proxy = net.createServer((client) => {
  client.once('data', (data) => {
    const { host, message, method, isTLS, port, httpVersion } =
      parseHttpMessage(data);

    if (isHostBlocked(host)) {
      const response = createHttpResponse(403, httpVersion);
      client.write(response);
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
      const response = createHttpResponse(200, httpVersion);
      client.write(response);
    } else server.write(data);

    client.on('error', (err) => {
      console.error(`[Client] [${err.name}]: `, err.message);
    });

    server.on('error', (err) => {
      console.error(`[Server] [${err.name}]: `, err.message);
    });
  });
});

proxy.on('error', (err) => {
  console.error(`[Proxy] [${err.name}]: `, err.message);
});

proxy.listen(port, hostname);
