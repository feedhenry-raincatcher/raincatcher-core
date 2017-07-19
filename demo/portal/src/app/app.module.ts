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

import { InMemoryDataService } from './data/in-memory-data.service';

import { environment } from '../environments/environment';
import { ConfigService } from './config.service';

// Router and routes setup
const routes: Routes = [
  { path: 'process-instances', component: ProcessInstanceComponent },
  { path: 'processes', component: ProcessComponent },
  { path: 'tasks', component: TaskComponent },
  { path: '', redirectTo: '/process-instances', pathMatch: 'full' }
]

const providers: Provider[] = [
  ConfigService
];
if (!environment.production) {
  providers.push(InMemoryDataService);
}

@NgModule({
  declarations: [
    AppComponent,
    ProcessInstanceComponent,
    TaskComponent,
    NavigationComponent,
    NavLinkComponent,
    ProcessComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ButtonsModule.forRoot(),
    RouterModule.forRoot(
      routes,
      { enableTracing: true }
    )
  ],
  providers: providers,
  bootstrap: [AppComponent]
})
export class AppModule { }
