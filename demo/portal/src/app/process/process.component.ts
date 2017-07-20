import {Process} from '@raincatcher/wfm';
import { ProcessService } from '../data/process.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rc-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnInit {
  processes: Process[];

  constructor(private service: ProcessService) { }

  ngOnInit() {
    this.service.getAll()
      .subscribe(processes => this.processes = processes);
  }

}
