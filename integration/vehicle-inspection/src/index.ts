import {ConsoleLogger} from '@raincatcher/logger';
import {HttpServer} from './http-server';
import {
  InMemoryProcessInstanceRepository,
  InMemoryProcessRepository,
  InMemoryTaskRepository
} from './repositories';

const server = new HttpServer(
  new InMemoryProcessRepository([], new InMemoryTaskRepository()),
  new InMemoryProcessInstanceRepository([]),
  new ConsoleLogger()
);

server.listen(() => console.info('setup from index.ts finished'));
