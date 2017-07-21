const sessionOpts = {
  secret: process.env.SESSION_SECRET || 'raincatcher',
  resave: false,
  saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      path: '/'
    }
};

export default sessionOpts;
