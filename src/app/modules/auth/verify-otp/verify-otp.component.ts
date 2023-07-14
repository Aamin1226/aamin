import {Component} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import Validation from '../validation';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../../services/auth.service';
import {PasswordStrengthValidator} from '../password-strength.validators'

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss'],
})
export class VerifyOtpComponent {
  verifyPasswordCodeForm!: FormGroup;
  password = '';
  validCode: boolean = false;
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private route: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.verifyPasswordCodeForm = this.formBuilder.group({
        code: new FormControl('', [Validators.required]),
        password: [null, Validators.compose([
          Validators.required, Validators.minLength(8), PasswordStrengthValidator])],
        confirm_password: new FormControl('', [Validators.required])
      },
      {
        validators: [Validation.match('password', 'confirm_password')],
      });
    this.activatedRoute.params.subscribe((parameter: any) => {
      if (parameter.code) {
        this.validateCode(parameter.code);
      }
    });
    this.password = 'password';
    this.confirmPassword = 'password';
  }

  validateCode(code: number) {
    const data = {
      code: code,
    };
    this.authService.validateCode(data).subscribe({
      next: (res) => {
        if (res.message == 'Valid code') {
          this.validCode = true;
          this.verifyPasswordCodeForm.patchValue({
            code: res.code,
          });
        } else {
          this.route.navigate(['/invalid-link']);
          // this.toastr.error("Invalid code")
        }
      },
      error: (err) => {
        this.route.navigate(['/invalid-link']);
        // this.toastr.error("Invalid code")
      },
    });
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
    if (!this.verifyPasswordCodeForm.valid) {
      return;
    } else {
      this.authService
        .verifyCodeAndPassword(this.verifyPasswordCodeForm.value)
        .subscribe({
          next: () => {
            this.toastr.success('Password reset successfully');
            this.route.navigate(['/']);
          },
          error: (err) => {
            this.toastr.error(err.error.message);
          },
        });
    }
  }
}
