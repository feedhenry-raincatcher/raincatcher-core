import { ConsoleLogger, LoggerManager } from '@raincatcher/logger';
import {HttpServer} from './http-server';
import {
  InMemoryProcessInstanceRepository,
  InMemoryProcessRepository,
  InMemoryTaskRepository
} from './repositories';

const logger = new ConsoleLogger();

const server = new HttpServer(
  new InMemoryProcessRepository([], new InMemoryTaskRepository()),
  new InMemoryProcessInstanceRepository([]),
  this.log.setLogger(logger)
);

server.listen(() => this.log.logger.info('setup from index.ts finished',
  {level: 'INFO', tag: 'integration:vehicle-inspection:src', src: 'index.ts'}));
