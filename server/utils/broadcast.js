// utils/broadcast.js
const subscribers = new Set();

export const addSubscriber = (res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  res.write(': connected\n\n'); // Keep-alive comment
  subscribers.add(res);

  res.on('close', () => {
    subscribers.delete(res);
  });
}

export const broadcast = (type, data) => {
  const message = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  subscribers.forEach(res => res.write(message));
}
