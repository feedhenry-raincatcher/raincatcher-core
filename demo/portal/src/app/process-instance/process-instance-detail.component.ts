import { ProcessInstance } from '@raincatcher/wfm';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProcessInstanceService } from '../data/process-instance.service';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'rc-process-instance.detail',
  templateUrl: './process-instance-detail.component.html',
  styleUrls: ['./process-instance-detail.component.css']
})
export class ProcessInstanceDetailComponent implements OnInit {
  sampleDate = new Date();
  instance: ProcessInstance;
  constructor(private service: ProcessInstanceService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
      .switchMap(params => this.service.getById(params['id']))
      .subscribe(instance => this.instance = instance)
  }

}
