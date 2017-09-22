# RainCatcher Api module

Module used to expose express based api for WFM objects.

### WFM specific implementations

Following api is being exposed:

- `/workorders`
- `/workflows`
- `/results`

This api is being added to new express router and it can be applied to any existing express based application
as follows:

```typescript
// Create api
const api = new WfmRestApi();

// Mount api into path
app.use('/api', api.createWFMRouter());
```

Api requires mongodb connection that needs to be setup as separate step

```typescript
api.setDb(db);
```
See demo application integration or [example application](https://github.com/feedhenry-raincatcher/raincatcher-core/tree/master/cloud/wfm-rest-api/example) for more details.

### Custom database integrations

Custom database integrations are possible thanks to `PagingDataRepository` interface.

## Rest API

Module provides a way to dynamically create API for different business objects.
Created api will use simplified implementations for typical create, read, delete and update operations. It's not recomended to use `wfm-rest-api` outside the WFM framework. Please use database driver or ORM framework or your choice.

## Rest API structure

API produces and expects JSON objects.
Structure of payload will vary depending on the interface passed as generic parameter to `PagingDataRepository`
For example:

```typescript
interface MyData{
  name:string
  fieldNumber:1
}
const repository = new PagingDataRepository<MyData>();
```

## Rest API definitions

Definitions apply to every object exposed by this API. Placeholder `{object}` can be replaced by `workflow`, `workorder` and `result`.

### Retrieve list

> GET {object}/

##### Pagination
Supports pagination and sorting by providing additional query parameters:

- `page` page number
- `size` number of elements to return
- `sortField` sorting field
- `order` -1 for DESC and 1 for ASC

Example `/workorders?page=0&size=5&sortField=id&order=-1`

> **Note** - sorting parameters are optional.  When missing default sorting values are applied (10 results)

##### Filtering

List can be filtered by providing json as `filter` query parameter or `filter` as request body.

`filter` - json object with specific field

For example `filter = { 'reviewer': 'Paolo'}`

> **Note** - Due to nature of the url filter needs to be encoded to be passed as url

### Retrieve specific object by id

> GET {object}/:objectId

Retrieve specific object by id

Example `/workorders/B1r71fOBr`

Return 204

### Save object

> POST {object}/

Paylod should contain at least `id` field that will be used as object id.

### Update object

> PUT {object}/:objectId

Where `:objectId` is an `id` field of the object.

### Delete object

> DELETE {object}/:objectId

Where `:objectId` is an `id` field of the object.

### Search for objects

Retrieves a list of objects that matches a user query.

> GET {object}/search

A query can be made by providing a json `filter` query parameter

For example `filter = {'title': 'Example'}`

### Error handling

In case of error express `next` callback is being called with `ApiError` instance.
Users should build their own middleware for global error handling in their application.

Api will returns non 200 status in case of error.

`400` - For user input error (missing required field etc.)
`500` - For internal server errors

Api will return `204` status code if content is missing (for example invalid id was provided)

For every error `ApiError` object is being returned.
For example:

```typescript
{
  "code": "InvalidID",
  "message": "Provided id is invalid",
  "statusCode": 400
}
```
Clients can adapt it to their preffered way of presenting errors to user (html,json etc.)

> **Note:** If you apply middleware security, additional  `401` and `403` statuses may be returned
