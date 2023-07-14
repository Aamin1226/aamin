import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators,} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../../services/auth.service';
import {DocumentService} from '../../../services/document.service';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss']
})
export class CreateTeamComponent {
  createTeamForm!: FormGroup;

  constructor(
    public documentService: DocumentService,
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public toastService: ToastrService
  ) {
  }

  ngOnInit() {
    this.createTeamForm = this.formBuilder.group({
      team_name: new FormControl('', [Validators.required])
    });
  }

  closeModal() {
    this.documentService.emitClickEvent();
  }

  createTeam() {
    this.authService.createTeam(this.createTeamForm.value).subscribe({
      next: (res:any) => {
        this.setDefault(res.data.id);

      },
      error: (err) => {
        this.toastService.error(err.error.message);
      },
    });
  }

  setDefault(id: any) {
    this.documentService.setDefaultTeams(id).subscribe({
      next: (res) => {
        this.sendTokenToChromeExtension({
          extensionId: 'nnindblljkmlneohokfekacghdepmial',
          teamId: res.data.id,
        });
        // this.documentService.emitClickEvent('team-change');
        // this.documentService.emitChangeTeamEvent();
        this.documentService.emitClickEvent('team-change');
        this.documentService.emitClickEvent( 'default-change');
        this.documentService.emitClickEvent();
      },
      error: (err) => {
        err.error.message;
      },
    });
  }

  sendTokenToChromeExtension({extensionId, teamId}: any) {
    try {
      // chrome.runtime.sendMessage(
      //   'nnindblljkmlneohokfekacghdepmial',
      //   {action: 'checkInstalled'},
      //   (response: any) => {
      //     if (response) {
      //       chrome.runtime.sendMessage(
      //         extensionId,
      //         {teamId},
      //         (response: any) => {
      //           if (!response.success) {
      //             // console.log('error sending message', response);
      //             return response;
      //           }
      //           // console.log('Sucesss ::: ', response.message);
      //         }
      //       );
      //     } else {
      //     }
      //   }
      // );
    } catch (error) {
    }
  }
}
