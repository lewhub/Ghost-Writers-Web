import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { WikiService } from './services/wiki.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import {WebStorageModule, LocalStorageService} from "angular2-localstorage";

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    WebStorageModule
  ],
  providers: [WikiService, LocalStorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
