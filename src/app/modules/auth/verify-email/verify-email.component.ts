import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent {
  constructor(
    private authService: AuthService,
    private route: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((parameter: any) => {
      if (parameter.id && parameter.hash) {
        this.validateCode(parameter.id, parameter.hash);
      }
    });
  }

  validateCode(id: string, hash: string) {
    const data = {
      id: id,
      hash: hash,
    };
    this.authService.validateEmail(data).subscribe({
      next: (res) => {
        console.log(res);
        // this.route.navigate(['/']);
      },
      error: (err) => {
        // this.route.navigate(['/']);
        console.log(err);
      },
    });
  }
}
