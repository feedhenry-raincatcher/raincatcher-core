# wfm-user

Module responsible for user operations required by all WFM modules.

## RESTfull API

### Filter

> GET /?filter=name&limit=10

Retruns JSON array containing users
```json
{
  "users": []
}
```

#### Example

http://localhost:8001/api/users?filter=a&limit=1

> Note: Default limit is 10

#### Errors

400 - missing filter `{code: 'InvalidFilter'}`

### Get user by id

> GET /:id

Gets user by id

#### Example

http://localhost:8001/api/users/fhj3nf

#### Errors

400 - missing id `{code: 'InvalidID'}`

## Implementing UserRepository

In order for module to be able to fetch user data any implementations
need to implement user repository class.

See demo application integration or [example application](./example) for more details.

## Relation to security module

The main purpose of this module is to allow administrators to retrieve and manage mobile users.
This data may come from different datasource than data from security module.
This module should not be used to fech any user related details like user profile etc.





