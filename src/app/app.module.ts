import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ModelsListComponent } from './models-list/models-list.component';
import { ModelDetailComponent } from './model-detail/model-detail.component';
import { AppRoutingModule } from './app-routing.module';
import { TipDirective } from './tip.directive';
import { ProviderLogoComponent } from './provider-logo/provider-logo.component';

@NgModule({
  declarations: [AppComponent, ModelsListComponent, ModelDetailComponent, TipDirective, ProviderLogoComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule, AppRoutingModule],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
