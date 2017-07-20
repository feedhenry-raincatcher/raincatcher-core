import { logger } from '@raincatcher/logger';
import {HttpServer} from './http-server';
import {
  InMemoryProcessInstanceRepository,
  InMemoryProcessRepository,
  InMemoryTaskRepository
} from './repositories';

const server = new HttpServer(
  new InMemoryProcessRepository([], new InMemoryTaskRepository()),
  new InMemoryProcessInstanceRepository([])
);

server.listen(() => logger.info('setup from index.ts finished', {tag: 'integration:vehicle-inspection:src'}));
