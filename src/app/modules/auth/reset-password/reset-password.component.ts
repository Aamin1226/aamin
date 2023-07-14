import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import Validation from '../validation';
import {PasswordStrengthValidator} from '../password-strength.validators'
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  resetPasswordForm!: FormGroup;
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private route: Router
  ) {}
  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group(
      {
        old_password: [null, Validators.compose([
          Validators.required, Validators.minLength(8), PasswordStrengthValidator])],
        new_password: new FormControl('', [Validators.required]),
      },
      {
        validators: [Validation.match('old_password', 'new_password')],
      }
    );
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
    if (!this.resetPasswordForm.valid) {
      return;
    } else {
      this.authService
        .changePassword(this.resetPasswordForm.value)
        .subscribe({
          next: () => {
            this.toastr.success("Password changed successfully");
            this.route.navigate(['/dashboard']);
          },
          error: (err) => {
            this.toastr.error(err.error.message);
          },
        });
    }
  }
}
