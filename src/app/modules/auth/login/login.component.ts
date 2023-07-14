import {Component, ViewChild, ElementRef} from '@angular/core';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {PasswordStrengthValidator} from '../password-strength.validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  auth2: any;
  @ViewChild('loginRef', {static: true}) loginElement!: ElementRef;
  isLoggedin?: boolean;
  loginForm: FormGroup = this.formBuilder.group({
    email: [null, Validators.compose([Validators.required, Validators.pattern(/^[A-Za-z0-9_.+-]+@[A-Za-z0-9-]+\.[A-Za-z0-9-.]+$/)])],
    password: [
      null,
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        PasswordStrengthValidator,
      ]),
    ],
  });
  password = '';
  showPassword = false;
  resendEmail: boolean = false;
  passwordControlAvailable: boolean = true;
  private accessToken = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private route: Router,
    private router: ActivatedRoute,
    // private authService1: SocialAuthService,
    private oidcSecurityService: OidcSecurityService
  ) {
    var token = this.authService.getAuthToken()
    if (token) {
      this.route.navigate(['/dashboard']);
    }
  }

  loginWithGoogleOidc(): void {
    this.oidcSecurityService.authorize();
  }

  ngOnInit() {
    this.oidcSecurityService.checkAuth().subscribe((loginResponse: any) => {
      if (loginResponse.userData) {
        const userData = loginResponse.userData;
        const socialLoginData = {
          email: userData.email,
          first_name: userData.given_name,
          last_name: userData.family_name,
          google_id: userData.sub,
          provider: 'GOOGLE',
        };
        this.authService.googleLogin(socialLoginData).subscribe({
          next: (res) => {
            localStorage.setItem('kopist-token', res.token);
            localStorage.setItem('name', res.data.first_name);
            localStorage.setItem('last-name', res.data.last_name);
            localStorage.setItem('id', res.data.id);
            localStorage.setItem('provider', 'GOOGLE');
            this.route.navigate(['/dashboard']);
            this.checkExtensionInstalled(res.token, res.data.first_name)
          },
          error: (err) => {
            this.toastr.error(err.error.message)
          },
        });
      }
    });
    // this.googleAuthSDK();
    this.loginForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required, Validators.pattern(/^[A-Za-z0-9_.+-]+@[A-Za-z0-9-]+\.[A-Za-z0-9-.]+$/)])],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          PasswordStrengthValidator,
        ]),
      ],
    });
    this.password = 'password';
  }


  get f() {
    return this.loginForm.controls;
  }

  handleShowPassword() {
    if (this.password === 'password') {
      this.password = 'text';
      this.showPassword = true;
    } else {
      this.password = 'password';
      this.showPassword = false;
    }
  }

  forgotPassword() {
    this.route.navigateByUrl('/forgot-password');
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const data = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.authService.login(data).subscribe({
      next: (res) => {
        if (res.status == 'failed') {
          this.toastr.error(res.message);
        } else {
          window.postMessage(
            {data: res.token, type: data},
            'https://localhost:4200'
          );
          // this.toastr.success(res.message);
          localStorage.setItem('kopist-token', res.access_token);
          localStorage.setItem('name', res.data.first_name);
          localStorage.setItem('id', res.data.id);
          localStorage.setItem('provider', 'FORM');
          localStorage.setItem('full-name', (res.data.first_name + " " + res.data.last_name));
          localStorage.setItem('last-name', res.data.last_name);
          this.checkExtensionInstalled(res.access_token, res.data.first_name)
          const returnUrl = this.router.snapshot.queryParams['returnUrl'] || '/dashboard';
          this.route.navigateByUrl(returnUrl);
        }
      },
      error: (error) => {
        // this.toastr.error(error.error.message);
        if (error.error.message == 'Email is not verifed') {
          // this.resendEmail = true;
          this.resendVerifyLink()
        }else{
          this.toastr.error(error.error.message);
        }
      },
    });
  }

  resendVerifyLink() {
    if (!this.loginForm.invalid) {
      const data = {
        email: this.loginForm.value.email,
      };
      this.authService.resendCodeOnEmail(data).subscribe({
        next: (res) => {
          this.toastr.success(
            'The email has been sent your registered email address'
          );
          this.route.navigate([`/login-verified/${this.loginForm.value.email}`]);
          // this.route.navigate(['/']);
        },
        error: (error) => {
          this.toastr.error('The selected email is invalid');
        },
      });
    } else {
      return;
    }
    // alert(this.email)
  }


  loginWithGoogle(): void {
  }

  checkExtensionInstalled(jwt: any, name: any) {
    try {
      // chrome.runtime.sendMessage('nnindblljkmlneohokfekacghdepmial', {action: 'checkInstalled'}, function (response) {
      //   if (response) {
      //     chrome.runtime.sendMessage('nnindblljkmlneohokfekacghdepmial', {jwt, name}, (response: any) => {
      //       if (!response.success) {
      //         console.log('error sending message', response);
      //         return response;
      //       }
      //     });
      //     // The extension is installed.
      //   } else {
      //     // The extension is not installed.
      //   }
      // });
    } catch (error) {

    }

  }
}
