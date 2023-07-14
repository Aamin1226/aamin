import {Component} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
})
export class ForgotComponent {
  emailCodeSendForm!: FormGroup;
  emailSent: boolean = false;
  resendEmail: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private route: Router
  ) {
  }

  ngOnInit() {
    this.emailCodeSendForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required, Validators.pattern(/^[A-Za-z0-9_.+-]+@[A-Za-z0-9-]+\.[A-Za-z0-9-.]+$/)])],
    });
  }

  //  emailValidator(control: FormControl): { [key: string]: boolean } | null {
  //   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  //   if (control.value && !emailRegex.test(control.value)) {
  //     return { 'email': true };
  //   }

  //   return null;
  // }
  onSubmit() {
    if (!this.emailCodeSendForm.invalid) {
      const data = {
        email: this.emailCodeSendForm.value.email,
      };
      this.authService.resetPassword(data).subscribe({
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

    // alert(this.email)
  }

}
