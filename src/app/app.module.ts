import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi
} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PinComponent } from './pin/pin.component';
import { PinResetComponent } from './pin-reset/pin-reset.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Interceptor } from 'src/utility/http-interceptor.service';
import { AuthGuard } from 'src/utility/auth.guard';
import { LoaderService } from 'src/utility/loader.service';
import { LoaderComponent } from './loader/loader.component';
import { NgHttpLoaderComponent, pendingRequestsInterceptor$ } from 'ng-http-loader';

@NgModule({
  declarations: [
    AppComponent,
    PinComponent,
    PinResetComponent,
    LoaderComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgHttpLoaderComponent
  ],
  providers: [
    AuthGuard,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([pendingRequestsInterceptor$])
    )
  ]
})
export class AppModule { }
