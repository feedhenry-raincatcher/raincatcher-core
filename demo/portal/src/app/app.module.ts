import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Provider } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ButtonsModule } from 'ngx-bootstrap';
import { MomentModule } from 'angular2-moment'

import { AppComponent } from './app.component';
import { ProcessInstanceComponent } from './process-instance/process-instance.component';
import { ProcessInstanceDetailComponent } from './process-instance/process-instance-detail.component';
import { TaskComponent } from './task/task.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NavLinkComponent } from './nav-link/nav-link.component';
import { ProcessComponent } from './process/process.component';
import { FooterComponent } from './footer/footer.component';

import { ProcessService } from './data/process.service';
import { ProcessInstanceService } from './data/process-instance.service';

import { environment } from '../environments/environment';
import { ConfigService } from './config.service';
import { RoutingModule } from './routing/routing.module';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ButtonsModule.forRoot(),
    RoutingModule,
    MomentModule
  ],
  providers: [
    ConfigService,
    ProcessService,
    ProcessInstanceService
  ],
  declarations: [
    AppComponent,
    ProcessInstanceComponent,
    TaskComponent,
    NavigationComponent,
    NavLinkComponent,
    ProcessComponent,
    FooterComponent,
    ProcessInstanceDetailComponent
  ]
})
export class AppModule { }
