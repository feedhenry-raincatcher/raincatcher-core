# RainCatcher PassportAuth
The PassportAuth module is RainCatcher's implementation of  [PassportJS](http://passportjs.org/) and is the default authentication and authorization module for RainCatcher. The PassportAuth module provides:
- Creation and initialization of a Passport authentication service using Passport's local and JWT strategy
- Protection of express routes from requests by user authentication and authorization
- Usage of persistent login sessions using [express-session](https://github.com/expressjs/session)


## Quick Start
### Setup
```typescript
import { PassportAuth, UserRepository, UserService }  from '@raincatcher/auth-passport'

// Initialize user data repository, user service and passport
const userRepo: UserRepository = new YourUserRepository();
const userService: UserService = new YourUserService();
const authService: PassportAuth = new PassportAuth(userRepo, userService);
...
authService.init(router, sessionOptions);
  or
authService.init(router, undefined, secret);
...
```
In order to use cookie-based authentication, specify the sessionOptions.
- For more information about the available express session options, see  [express-session](https://github.com/expressjs/session).

When the sessionOptions is not passed, Passport will use token-based authentication using Passport's JWT strategy by default.
- Ensure that a secret is defined to be used by Passport's JWT strategy.

### Usage
#### Authentication
Using session based authentication
```typescript
app.post('/cookie-login', authService.authenticate('local', options));
```
- For more information on Passport's authenticate options, see [PassportJS authenticate documentation](http://passportjs.org/docs/authenticate)

Using token based authentication
```typescript
app.post('/token-login', authService.authenticateWithToken(secret, userService, userRepo));
```
- This sends the signed token and user profile back to the client upon successful authentication.
- The token's payload contains the user's username and is signed using the given secret.

#### Protecting Routes
```typescript
app.get('/secureEndpoint', authService.protect('admin'), (req: express.Request, res: express.Response) => {
    res.json({routeName: '/secureEndpoint', msg: 'authenticated and authorized to access secure resource'});
});
```

#### JWT: 
When using token based authentication, the JWT token needs to be included in each subsequent requests after a successful login as part of the `Authorization` header: 
  ```
    Authorization: JWT JSON_WEB_TOKEN_STRING
  ```
- For more information on Passport's JWT strategy, please see [passport-jwt](https://github.com/themikenicholson/passport-jwt)

### Sample Implementation
See [./example](https://github.com/feedhenry-raincatcher/raincatcher-core/tree/master/cloud/passportauth/example) for a sample implementation
