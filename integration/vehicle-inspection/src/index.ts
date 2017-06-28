import {
  InMemoryProcessInstanceRepository,
  InMemoryProcessRepository,
  InMemoryTaskRepository
} from './repositories';
import {Server} from './server';

const server = new Server(
  new InMemoryProcessRepository([], new InMemoryTaskRepository()),
  new InMemoryProcessInstanceRepository([])
);

server.listen(() => console.info('setup from index.ts finished'));
