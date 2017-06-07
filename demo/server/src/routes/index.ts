'use strict';

import * as express from 'express';
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
  res.json({ name: 'raincatcher' });
});

export default router;
