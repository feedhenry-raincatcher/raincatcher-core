import {environment} from '../../environments/environment';
import {ProcessInstanceComponent} from '../process-instance/process-instance.component';
import {Routes, RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
import { ProcessComponent } from '../process/process.component';
import { TaskComponent } from '../task/task.component';
import { ProcessInstanceDetailComponent } from '../process-instance/process-instance-detail.component'

const routes: Routes = [
  { path: 'process-instances/:id', component: ProcessInstanceDetailComponent },
  { path: 'process-instances', component: ProcessInstanceComponent },
  { path: 'processes', component: ProcessComponent },
  { path: 'tasks', component: TaskComponent },
  { path: '', redirectTo: '/process-instances', pathMatch: 'full' }
]

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: !environment.production }
    )
  ],
  exports: [ RouterModule ]
})
export class RoutingModule { }
