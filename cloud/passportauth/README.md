# RainCatcher Passport Auth
Raincatcher authentication and authorization module using [PassportJS][1]. This module creates and initializes a Passport authentication service using Passport's local strategy.
This allows express routes to be protected from requests by checking if the user is authenticated and/or authorized with the required role. This module also
uses persistent login sessions using [express-session][2].


## Quick Start
#### Setup & Pre-requisites
1. **Implement BaseUser Interface**

    Implement the BaseUser interface defined in `./src/user/BaseUser.ts` in order to allow for retrieving the required user data from your data source.
    See `./example/UserApi.ts` for a sample implementation of this interface

2. **Initialize Passport auth service**
   ```typescript
       ...
       const userSec = new UserSecService(userApi);
       const passportSetup = new PassportSetup(userSec);
       const authService = new PassportAuth(userSec);
       ...
   ```
    - UserSecService
        - Params:
            - UserApi **[Required]**: Implementation of the BaseUser interface that is used to retrieve user data (id, login id, password hash and roles)
             from your specified data source.
    - PassportSetup
        - Params:
            - UserSec **[Required]**
    - PassportAuth
        - Params:
            - UserSec **[Required]**
            - LoginRoute **[Optional]**: The login route used to redirect to if the user is not authenticated. Default value: `'/login'`

3. **Setup Passport**
    ```typescript
        ...
        // Configuration for express session options
        const sessionOpts = {
          secret: process.env.SESSION_SECRET || 'raincatcher',
          resave: false,
          saveUninitialized: false,
          cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            path: '/'
          }
        };
        ...

        passportSetup.init(app, sessionOpts);
    ```
    - passportSetup.init(): This will initialize express session and passport, as well as set the strategy, serializeUser and deserializeUser
    functions to be used by passport.
        - params:
            - app **[Required]**: Express app
            - sessionOpts **[Required]**: Express session options

    See [express-session][2] for more information on the available express session options.

#### Usage
```typescript
    app.get('/secureEndpoint', authService.protect('admin'), (req: express.Request, res: express.Response) => {
      res.json({routeName: '/secureEndpoint', msg: 'authenticated and authorized to access secure resource'});
    });
```
  - authService.protect()
      - Params
          - Role **[Optional]**: Role the user requires in order to be able to access this resource.


See `./example` for a full sample implementation

<!-- References -->
[1]: http://passportjs.org/
[2]: https://github.com/expressjs/session
