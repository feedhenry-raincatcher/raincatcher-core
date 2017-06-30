import {ConsoleLogger} from '../src/ConsoleLogger';
import {suite,test} from 'mocha-typescript';
import * as assert from 'assert';
import * as os from 'os';

var capcon: any = require('capture-console');


@suite
class ConsoleLoggerTest {
  private consoleLogger: ConsoleLogger = new ConsoleLogger();
  private readonly loggerObject: object = {test: 'test'};
  private consoleBuffer: string = "";

  private readonly LOGGER_OBJECT_STRING = "[ { test: 'test' }, { test: 'test' } ]";

  public before(){
    capcon.startCapture(process.stdout,(stdout: string) => this.consoleBuffer += stdout);
    capcon.startCapture(process.stderr,(stderr: string) => this.consoleBuffer += stderr);
  }

  public after(){
    this.consoleBuffer = "";
  }

  public static after(){
    capcon.stopCapture(process.stdout);
    capcon.stopCapture(process.stderr);
  }

  @test
  public testLogDebug(){
    this.consoleLogger.debug('debug',this.loggerObject,this.loggerObject);
    let expectedConsoleOutput: string = 'debug ' + this.LOGGER_OBJECT_STRING + os.EOL;
    assert.equal(this.consoleBuffer,expectedConsoleOutput);
  }

  @test
  public testLogError(){
    this.consoleLogger.error('error',this.loggerObject);
    let expectedConsoleOutput: string = 'error ' + this.LOGGER_OBJECT_STRING + os.EOL;
  }

  @test
  public testLogInfo(){
    this.consoleLogger.info('info',this.loggerObject);
    let expectedConsoleOutput: string = 'info ' + this.LOGGER_OBJECT_STRING + os.EOL; 
  }

  @test
  public testLogWarn(){
    this.consoleLogger.warn('warn',this.loggerObject);
    let expectedConsoleOutput: string = 'warn ' + this.LOGGER_OBJECT_STRING + os.EOL;
  }
}
