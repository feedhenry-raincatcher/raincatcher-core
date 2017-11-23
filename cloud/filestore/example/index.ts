import { BunyanLogger, getLogger, setLogger} from '@raincatcher/logger';
import { createRouter, FileMetadata, FileStorage, LocalStorage } from '../src/index';

// Create express middleware
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';

const app = express();
setLogger(new BunyanLogger({name: 'Filestore example', level: 'debug'}));

// middleware
app.use(bodyParser.json());
app.use(cors());

const engine: FileStorage = new LocalStorage();
const router = createRouter(engine);

app.use('/', router);
app.listen(3000, function() {
  getLogger().info('Example app listening on port 3000!');
});
// If you wish to see logs;
process.env.DEBUG = 'fh-mbaas-api:sync';
