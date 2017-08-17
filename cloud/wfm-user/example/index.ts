import { getLogger } from '@raincatcher/logger';
import * as Bluebird from 'bluebird';
import * as express from 'express';
import * as path from 'path';
import { User, UserController, UsersRepository } from '../src/index';

const app = express();

/**
 * Simplified example UsersRepository.
 * Implementation can fetch users from databases, LDAP etc.
 */
class ExampleRepository implements UsersRepository {
  public retrieveUsers(filter: string, limit: number): Bluebird<User[]> {
    const exampleUser = { id: 1, name: 'Example User' };
    return Bluebird.resolve([exampleUser]);
  }
}

// Create repository
const repository = new ExampleRepository();
// Create api
const api = new UserController(repository);

// Mount api into path
app.use('/api/users', api.buildRouter());

app.use(function(err: any, req: express.Request, res: express.Response, next: any) {
  getLogger().error(err);
  res.status(500).send(err);
});

app.listen(3000, function() {
  getLogger().info('Example auth app listening on port 3000');
});
