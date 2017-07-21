import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Provider } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { ButtonsModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { ProcessInstanceComponent } from './process-instance/process-instance.component';
import { TaskComponent } from './task/task.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NavLinkComponent } from './nav-link/nav-link.component';
import { ProcessComponent } from './process/process.component';
import { FooterComponent } from './footer/footer.component';


import { environment } from '../environments/environment';
import { ConfigService } from './config.service';
import { RoutingModule } from './routing/routing.module';


const providers: Provider[] = [
  ConfigService
];
const imports = [
  BrowserModule,
  BrowserAnimationsModule,
  HttpClientModule,
  ButtonsModule.forRoot(),
  RoutingModule
]
const declarations = [
  AppComponent,
  ProcessInstanceComponent,
  TaskComponent,
  NavigationComponent,
  NavLinkComponent,
  ProcessComponent,
  FooterComponent
]

@NgModule({
  declarations,
  imports,
  providers,
  bootstrap: [AppComponent]
})
export class AppModule { }
