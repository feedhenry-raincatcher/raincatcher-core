'use strict';

import * as express from 'express';
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
  const api = { name: 'raincatcher', version: require('../../package.json').version };
  res.json(api);
});

router.get('/login', (req: express.Request, res: express.Response) => {
  res.render('login', {
    title: 'Feedhenry Work Force Management'
  });
});

router.post('/login', (req: express.Request, res: express.Response) => {
  const api = { name: 'raincatcher', version: require('../../package.json').version };
  res.json(api);
});

export default router;
