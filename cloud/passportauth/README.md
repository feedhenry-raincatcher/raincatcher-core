# RainCatcher Passport Auth
Raincatcher authentication and authorization module using [PassportJS](http://passportjs.org/).
This module allows the:
- Creation and initialization of a Passport authentication service using Passport's local strategy.
- Protection of express routes from requests by user authentication and authorization.
- Usage of persistent login sessions using [express-session](https://github.com/expressjs/session).


## Quick Start
#### Setup
```typescript
...
import { PassportAuth, UserRepository, UserService }  from '@raincatcher/auth-passport'

// Initialize user data repository, user service and passport
const userRepo: UserRepository = new YourUserRepository();
const userService: UserService = new YourUserService();
const authService: PassportAuth = new PassportAuth(userRepo, userService);
...
authService.init(app, sessionOptions); // Initializes express app to use passport and express-session
...
```
Visit [express-session](https://github.com/expressjs/session) to find more information about the available express
session options.

#### Usage
```typescript
app.get('/secureEndpoint', authService.protect('admin'), (req: express.Request, res: express.Response) => {
    res.json({routeName: '/secureEndpoint', msg: 'authenticated and authorized to access secure resource'});
});
```

See [./example](./example/index.ts) for a sample implementation
