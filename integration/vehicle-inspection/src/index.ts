import { ConsoleLogger, LoggerManager } from '@raincatcher/logger';
import {HttpServer} from './http-server';
import {
  InMemoryProcessInstanceRepository,
  InMemoryProcessRepository,
  InMemoryTaskRepository
} from './repositories';

this.log.logger = new ConsoleLogger();

const server = new HttpServer(
  new InMemoryProcessRepository([], new InMemoryTaskRepository()),
  new InMemoryProcessInstanceRepository([]),
  this.log.setLogger(this.log.logger)// new ConsoleLogger()
);

server.listen(() => this.log.logger.info('setup from index.ts finished'));
