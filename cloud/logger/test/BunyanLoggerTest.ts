import {BunyanLogger} from '../src/BunyanLogger';
import {test,suite} from 'mocha-typescript';

const loggerObject: object = {test: 'test'};
const emptyObject: object = {};

@suite
class BunyanLoggerTest {

  private bunyanLogger: BunyanLogger = new BunyanLogger({name: 'test', stream: process.stdout});

  @test
  public testLogDebug(){
    this.bunyanLogger.debug('debug',loggerObject,loggerObject);
  }

  @test
  public testLogError(){
    this.bunyanLogger.error('error',loggerObject);
  }

  @test
  public testLogInfo(){
    this.bunyanLogger.info('info',loggerObject);
  }

  @test
  public testLogWarn(){
    this.bunyanLogger.warn('warn',loggerObject);
  }  
}