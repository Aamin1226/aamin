import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DocumentService } from '../../../services/document.service';

@Component({
  selector: 'app-invite-member',
  templateUrl: './invite-member.component.html',
  styleUrls: ['./invite-member.component.scss'],
})
export class InviteMemberComponent {
  pendingTab: boolean = false;
  teamName:any;
  @Input() teamId: any;
  roleDropdown: boolean = false;
  invitationSuccess: boolean = false;
  emailInvitationForm!: FormGroup;
  pendingMembers: any;
  teamUserData: any;
  roles: any;
  emails: any[] = [];
  selectedRole:any
  // @Output() teammateInvited = new EventEmitter();
  constructor(
    public documentService: DocumentService,
    public formBuilder: FormBuilder,
    public toastService: ToastrService
  ) {}
  ngOnInit() {
    this.getRoles();
    this.emailInvitationForm = this.formBuilder.group({
      emails: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^[A-Za-z0-9_.+-]+@[A-Za-z0-9-]+\.[A-Za-z0-9-.]+$/
          ),
        ]),
      ],
    });
    this.getPendingUserOfTeam(this.teamId);
  }
  closeModal() {
    this.documentService.emitClickEvent();
  }
  sendInvitation() {
   if(this.emailInvitationForm.value.emails){
    const enteredEmails = this.emailInvitationForm.value.emails;
    const emailWithoutComma = enteredEmails.replace(/,/g, '');
    this.emails.push(emailWithoutComma);
    this.emailInvitationForm.reset();
   }

    const data = {
      team_id: this.teamId,
      role_id:this.selectedRole.id,
      email: this.emails,
    };
    this.documentService.sendInvitationToTeam(data).subscribe({
      next: (res) => {
        // this.teammateInvited.emit("invited");
        // this.documentService.emitClickEvent();
        this.emailInvitationForm.reset();
        this.invitationSuccess = true;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
      },
    });
  }
  getPendingUserOfTeam(id: any) {
    this.documentService.getTeamDetails(id).subscribe({
      next: (res: any) => {
        this.teamName = res.data.team_name
        this.teamUserData = res.data.team_members;
        this.pendingMembers = this.teamUserData.filter(
          (arr: any) => arr.status == 'Pending'
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  removeInvitation(userId: any,email:any) {
    const data = {
      team_id: this.teamId,
      email: email,
    };
    this.documentService.removeInvitationToTeam(data).subscribe({
      next: (res:any) => {
        this.getPendingUserOfTeam(this.teamId);
        this.toastService.success(res.message);
      },
      error: (err) => {
        this.toastService.error(err.error.message);
      },
    });
  }
  resendInvitation(email:any,roleId:any) {
    const data = {
      team_id: this.teamId,
      email:[email],
      role_id:roleId
    };
    this.documentService.resendInvitationToTeam(data).subscribe({
      next: (res:any) => {
        // this.documentService.emitClickEvent();
        this.toastService.success(res.message);
      },
      error: (err) => {
        this.toastService.error(err.error.message);
      },
    });
  }
  resendAllInvitation() {
    this.documentService.resendAllInvitationToTeam(this.teamId).subscribe({
      next: (res:any) => {
        // this.documentService.emitClickEvent();
        this.toastService.success(res.message);
      },
      error: (err) => {
        this.toastService.error(err.error.message);
      },
    });
  }
  getRoles() {
    this.documentService.getRoles().subscribe({
      next: (res: any) => {
        this.roles = res.data;
        this.selectedRole=this.roles[0]
      },
      error: (err) => {
        this.toastService.error(err.error.message);
      },
    });
  }
  onCommaClick() {}
  // @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key == ',') {
      if(this.emailInvitationForm.controls['emails'].hasError('pattern') && (this.emailInvitationForm.controls['emails'].dirty || this.emailInvitationForm.controls['emails'].touched)){
        return;
      }
      // this.emails.push(this.emailInvitationForm.value.emails);
      // this.emailInvitationForm.reset();
      event.preventDefault();
      const enteredEmails = this.emailInvitationForm.value.emails;
    const emailWithoutComma = enteredEmails.replace(/,/g, '');

    this.emails.push(emailWithoutComma);
    this.emailInvitationForm.reset();
    }
  }
  selectRole(role: any) {
    this.selectedRole=role
    this.roleDropdown= false;
  }

  spliceChip(index:any){
    if(index > -1){
      this.emails.splice(index,1)
    }
  }

  closeMenu(){
    this.roleDropdown = false;
  }
}
