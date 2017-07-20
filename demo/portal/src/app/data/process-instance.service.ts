import { Injectable } from '@angular/core';
import { ProcessInstance } from '@raincatcher/wfm';
import { FixtureService } from './fixture.service';
import { processInstances } from './fixtures/process-instances';

@Injectable()
export class ProcessInstanceService extends FixtureService<ProcessInstance> {
  constructor() {
    super();
    this.data = processInstances;
  }
}
