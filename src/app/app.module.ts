import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { WikiService } from './services/wiki.service';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, HttpModule
  ],
  providers: [WikiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
