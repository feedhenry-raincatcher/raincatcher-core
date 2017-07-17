import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { ButtonsModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { ProcessInstanceComponent } from './process-instance/process-instance.component';
import { TasksComponent } from './tasks/tasks.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NavLinkComponent } from './nav-link/nav-link.component';
// Router and routes setup
const routes: Routes = [
  { path: 'process-instances', component: ProcessInstanceComponent },
  { path: 'tasks', component: TasksComponent },
  { path: '', redirectTo: '/process-instances', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent,
    ProcessInstanceComponent,
    TasksComponent,
    NavigationComponent,
    NavLinkComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonsModule.forRoot(),
    RouterModule.forRoot(
      routes,
      { enableTracing: true }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
