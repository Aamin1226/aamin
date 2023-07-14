import {Component, ElementRef, ViewChild} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import Validation from '../validation';
import {AuthService} from '../../../services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {PasswordStrengthValidator} from '../password-strength.validators'
import {OidcSecurityService} from 'angular-auth-oidc-client';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  auth2: any;
  @ViewChild('signUpRef', {static: true}) loginElement!: ElementRef;
  registrationForm!: FormGroup;
  password = '';
  formStepper: number = 1
  showPassword = false;
  confirmPassword = '';
  showConfirmPassword = false;
  resendEmail: boolean = false;
  emailSent: boolean = false;
  dynamicHeight: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private route: Router,
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
            // this.checkExtensionInstalled(res.token,res.data.first_name)
          },
          error: (err) => {
            this.toastr.error(err.error.message)
          },
        });
      }
    });

    this.registrationForm = this.formBuilder.group(
      {
        name: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: [null, Validators.compose([Validators.required, Validators.pattern(/^[A-Za-z0-9_.+-]+@[A-Za-z0-9-]+\.[A-Za-z0-9-.]+$/)])],
        password: [null, Validators.compose([
          Validators.required, Validators.minLength(8), PasswordStrengthValidator])],
        confirmPassword: new FormControl('', [Validators.required]),
      },
      {
        validators: [Validation.match('password', 'confirmPassword')],
      });
    this.password = 'password';
    this.confirmPassword = 'password';
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

  handleShowConfirmPassword() {
    if (this.confirmPassword === 'password') {
      this.confirmPassword = 'text';
      this.showConfirmPassword = true;
    } else {
      this.confirmPassword = 'password';
      this.showConfirmPassword = false;
    }
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      return;
    }
    const data = {
      first_name: this.registrationForm.value.name,
      last_name: this.registrationForm.value.lastName,
      email: this.registrationForm.value.email,
      password: this.registrationForm.value.password,
    };
    this.authService.registerUser(data).subscribe({
      next: (res) => {
        if (res.status == 'failed') {
          this.toastr.error(res.message);
        } else {
          // this.route.navigate(['/']);
          this.toastr.success('Kopist has sent you a verify link on your email.');
          this.emailSent = true;
          this.resendEmail = true;
        }
      },
      error: (err) => this.toastr.error(err.error.message),
    });
  }

  resendOtp() {
    if (!this.registrationForm.invalid) {
      const data = {
        email: this.registrationForm.value.email,
      };
      this.authService.resendCodeOnEmail(data).subscribe({
        next: (res) => {
          this.toastr.success(
            'The email has been sent your registered email address'
          );
          // this.route.navigate(['/']);
          this.emailSent = true;
          this.resendEmail = true;
        },
        error: (error) => {
          this.toastr.error('The selected email is invalid');
        },
      });
    } else {
      return;
    }
  }

}
