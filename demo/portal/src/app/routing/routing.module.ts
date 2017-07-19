import {environment} from '../../environments/environment';
import {ProcessInstanceComponent} from '../process-instance/process-instance.component';
import {Routes, RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
import { ProcessComponent } from '../process/process.component';
import { TaskComponent } from '..//task/task.component';

const routes: Routes = [
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
