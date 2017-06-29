import {ConsoleLogger} from '@raincatcher/logger';
import {
  InMemoryProcessInstanceRepository,
  InMemoryProcessRepository,
  InMemoryTaskRepository
} from './repositories';
import {Server} from './server';

const server = new Server(
  new InMemoryProcessRepository([], new InMemoryTaskRepository()),
  new InMemoryProcessInstanceRepository([]),
  new ConsoleLogger()
);

server.listen(() => console.info('setup from index.ts finished'));
