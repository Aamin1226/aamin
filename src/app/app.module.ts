import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthModules} from './modules/auth/auth.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppInterceptorInterceptor} from './core/app-interceptor.interceptor';
import {AdminModule} from './layouts/admin/admin.module';
import {ToastrModule} from 'ngx-toastr';
import {RegisterComponent} from './modules/auth/register/register.component';
import {LoginComponent} from './modules/auth/login/login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthModule, LogLevel} from 'angular-auth-oidc-client';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    ToastrModule.forRoot({
      timeOut: 2000,
      progressBar: true,
      positionClass: 'toast-top-center'
    }),
    BrowserModule,
    // BrowserAnimationsModule,
    AppRoutingModule,
    AuthModules,
    AuthModule.forRoot({
      config: {
        authority: 'https://accounts.google.com',
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId: '554240591486-bp1ddkieovol67bnvp06ql3nguikl0e5.apps.googleusercontent.com',
        scope: 'openid profile email',
        responseType: 'id_token token',
        logLevel: LogLevel.Debug,
      },
    }),
    AdminModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AppInterceptorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
