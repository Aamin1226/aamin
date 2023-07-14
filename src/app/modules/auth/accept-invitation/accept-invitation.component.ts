import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-accept-invitation',
  templateUrl: './accept-invitation.component.html',
  styleUrls: ['./accept-invitation.component.scss']
})
export class AcceptInvitationComponent {
  constructor(
    private authService: AuthService,
    private route: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((parameter: any) => {
      if (parameter.id && parameter.email) {
        this.validateInviationDetails(parameter.id, parameter.email);
      }
    });
  }

  validateInviationDetails(id: string, email: string) {
    const data = {
      id: id,
      email: email,
    };
    this.authService.acceptInviation(data).subscribe({
      next: (res) => {
        this.route.navigate(['/']);
      },
      error: (err) => {
        // this.route.navigate(['/']);
        // console.log(err);
      },
    });
  }
}
