import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from './auth.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ForgotComponent} from './forgot/forgot.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {VerifyOtpComponent} from './verify-otp/verify-otp.component';
import {VerifyEmailComponent} from './verify-email/verify-email.component';
import {AcceptInvitationComponent} from './accept-invitation/accept-invitation.component';
import {LoginVerificationComponent} from './login-verification/login-verification.component';
import {ExpiredLinkComponent} from './expired-link/expired-link.component';

const routes: Routes = [{
  path: '',
  component: AuthComponent,
  children: [
    {
      path: '',
      component: LoginComponent,
    },
    {
      path: 'sign-up',
      component: RegisterComponent,
    },
    {
      path: 'forgot-password',
      component: ForgotComponent
    },
    {
      path: 'reset-password',
      component: ResetPasswordComponent
    },
    {
      path: 'verify-otp/:code',
      component: VerifyOtpComponent
    },
    {
      path: 'accept-invitation/:id/:email',
      component: AcceptInvitationComponent
    },
    {
      path: 'verify-email/:id/:hash',
      component: VerifyEmailComponent
    },
    {
      path: 'login-verified/:email',
      component: LoginVerificationComponent
    },
    {
      path: 'invalid-link',
      component: ExpiredLinkComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
