import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login-verification',
  templateUrl: './login-verification.component.html',
  styleUrls: ['./login-verification.component.scss']
})
export class LoginVerificationComponent {
  email: any;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((parameter: any) => {
      if (parameter.email) {
        this.email = parameter.email;
      }
    });
  }

  resendVerifyLink() {
    if (this.email) {
      const data = {
        email: this.email,
      };
      this.authService.resendCodeOnEmail(data).subscribe({
        next: (res) => {
          this.toastr.success(
            'The email has been sent your registered email address'
          );
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

}
