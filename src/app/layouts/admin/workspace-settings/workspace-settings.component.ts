import {Component} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../../services/auth.service';
import {DocumentService} from '../../../services/document.service';

@Component({
  selector: 'app-workspace-settings',
  templateUrl: './workspace-settings.component.html',
  styleUrls: ['./workspace-settings.component.scss'],
})
export class WorkspaceSettingsComponent {
  menuOptions: any = 'general';
  updateTeamForm!: FormGroup;
  myDefaultTeam: any;
  teamSetting: boolean = false;
  everyOneSetting: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public documentService: DocumentService,
    public toastService: ToastrService,
    public authService: AuthService
  ) {
  }

  ngOnInit() {
    this.updateTeamForm = this.formBuilder.group({
      team_name: new FormControl('', [Validators.required]),
    });
    this.getDefaultTeams();
  }

  teammateSettingChange(ev?: any) {
    this.teamSetting = ev.target.checked;

  }

  everyOneSettingChange(ev?: any) {
    this.everyOneSetting = ev.target.checked;
  }

  getDefaultTeams() {
    this.documentService.getDefaultTeams().subscribe({
      next: (res) => {
        this.myDefaultTeam = res.data;
        this.updateTeamForm.patchValue({
          team_name: this.myDefaultTeam.team_name,
        });
        this.getTeamsetting();
      },
      error: (err) => {
        // this.toastService.error(err.error.message);
      },
    });
  }

  updateTeam() {
    this.documentService
      .updateTeam(this.updateTeamForm.value, this.myDefaultTeam.id)
      .subscribe({
        next: (res) => {
          this.documentService.emitClickEvent('update-team');
          this.closeModal();
        },
        error: (err) => {
          this.toastService.error(err.error.message);
        },
      });
  }

  closeModal() {
    this.documentService.emitClickEvent();
  }

  getTeamsetting() {
    this.documentService.getTeamsetting(this.myDefaultTeam.id).subscribe({
      next: (res) => {
        if (res.data == null) {
          return;
        } else {
          this.teamSetting = res?.data?.teammate_can_comment == 'Yes' ? true : false
          this.everyOneSetting = res?.data?.everyone_can_comment == 'Yes' ? true : false
        }
      },
      error: (err) => {
      },
    });
  }

  changeTeamSetting() {

    const data = {
      team_id: this.myDefaultTeam.id,
      teammate_can_comment: this.teamSetting == true ? 'Yes' : 'No',
      everyone_can_comment: this.everyOneSetting == true ? 'Yes' : 'No',
    };
    this.documentService.changeTeamSetting(data).subscribe({
      next: (res) => {
        this.closeModal();
        this.getTeamsetting();
      },
      error: (err) => {
      },
    });
  }
}
