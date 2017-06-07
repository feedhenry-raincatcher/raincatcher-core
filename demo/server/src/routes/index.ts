'use strict';

import * as express from 'express';
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
  var test = { name: 'raincatcher', test: new Object()};
  test.test = test;
  res.json({test: test});
});

export default router;
