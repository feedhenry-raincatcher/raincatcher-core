import { Injectable } from '@angular/core';
import { processes } from './fixtures/processes'
import { Process } from '@raincatcher/wfm';
import { FixtureService } from './fixture.service';

@Injectable()
export class ProcessService extends FixtureService<Process> {
  constructor() {
    super();
    this.data = processes;
  }
}
