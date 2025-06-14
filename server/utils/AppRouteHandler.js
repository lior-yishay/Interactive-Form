import { broadcast } from './broadcast.js';

export const createRoute = ({ methodHandlers, broadcast: shouldBroadcast = false }) => {
  return async (req, res) => {
    const method = req.method.toLowerCase();
    const handler = methodHandlers[method];

    if (!handler) {
      return res.status(405).json({ status: 'ERROR', message: 'Method Not Allowed' });
    }

    try {
      const result = await handler(req);
      res.json(typeof result === 'object' ? result : { value: result });

      if (shouldBroadcast && method === 'post') {
        broadcast(req.originalUrl, result);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 'ERROR', message: err.message });
    }
  };
};
