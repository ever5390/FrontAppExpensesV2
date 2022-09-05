import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ListNotificationComponent } from '@modules/notification/list-notification/list-notification.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AsideComponent } from './layout/aside/aside.component';
import { HeaderComponent } from './layout/header/header.component';
import { SkeletonComponent } from './layout/skeleton/skeleton.component';
import { SharedModule } from './shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '@core/interceptor/token-interceptor';

@NgModule({
  declarations: [
    AppComponent,

    //components
    SkeletonComponent,
    AsideComponent,
    HeaderComponent,
    
    // ManageExpenseComponent,
    ListNotificationComponent
  ],
  imports: [
    BrowserModule,

    //Core
    SharedModule,
    CommonModule,
    AppRoutingModule
  ],
  providers: [
    //Para quitar los # en los PATH's que coloca por defecto angular
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
