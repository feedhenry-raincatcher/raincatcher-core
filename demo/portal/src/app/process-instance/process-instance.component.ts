import { ProcessInstance } from '@raincatcher/wfm';
import { Component, OnInit } from '@angular/core';
import { ProcessInstanceService } from '../data/process-instance.service';

@Component({
  selector: 'rc-process-instance',
  templateUrl: './process-instance.component.html',
  styleUrls: ['./process-instance.component.css']
})
export class ProcessInstanceComponent implements OnInit {
  processInstances: ProcessInstance[];

  constructor(private service: ProcessInstanceService) { }

  ngOnInit() {
    this.service.getAll()
      .subscribe(processInstances => this.processInstances = processInstances);
  }

}
