'use strict';

import * as express from 'express';
import * as passport from 'passport';
import {loginRequired} from '../auth/local';
const router = express.Router();

router.get('/', loginRequired, (req: express.Request, res: express.Response) => {
  const api = { name: 'raincatcher', version: require("../../package.json").version};
  res.json(api);
});

router.get('/login', (req: express.Request, res: express.Response) => {
  res.json({name: 'raincatcher-auth', msg: 'You need to login'});
});

router.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/failAuth'}));

router.get('/logout', loginRequired, (req: express.Request, res: express.Response) => {
  req.logout();
  res.json({name: 'raincatcher-auth', msg: 'logged out', user: req.user});
});

router.get('/failAuth', (req: express.Request, res: express.Response) => {
  res.json({name: 'raincatcher-auth', msg: 'incorrect credentials'});
});

export default router;
