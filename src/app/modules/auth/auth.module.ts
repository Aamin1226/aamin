import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthComponent} from './auth.component';
import {ForgotComponent} from './forgot/forgot.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {AuthRoutingModule} from './auth-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {ToastrModule} from 'ngx-toastr';
import {VerifyOtpComponent} from './verify-otp/verify-otp.component';
import {VerifyEmailComponent} from './verify-email/verify-email.component';
import {AcceptInvitationComponent} from './accept-invitation/accept-invitation.component';
import {LoginVerificationComponent} from './login-verification/login-verification.component';
import {ExpiredLinkComponent} from './expired-link/expired-link.component';

@NgModule({
  declarations: [
    AuthComponent,
    ForgotComponent,
    ResetPasswordComponent,
    VerifyOtpComponent,
    VerifyEmailComponent,
    AcceptInvitationComponent,
    LoginVerificationComponent,
    ExpiredLinkComponent,
  ],
  imports: [
    ToastrModule.forRoot({
      timeOut: 2000,
      closeButton: true,
      progressBar: true,
    }),
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
  ]
})
export class AuthModules {
}
