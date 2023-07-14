import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DocumentService } from '../../../services/document.service';

@Component({
  selector: 'app-change-role',
  templateUrl: './change-role.component.html',
  styleUrls: ['./change-role.component.scss'],
})
export class ChangeRoleComponent {
  @Input() memberDetails: any;
  @Input() teamId:any
  roles: any;
  selectedRole:any
  constructor(
    public documentService: DocumentService,
    public toastService: ToastrService
  ) {}

  ngOnInit() {
    this.getRoles();
  }

  closeModal() {
    this.documentService.emitClickEvent();
  }
  getRoles() {
    this.documentService.getRoles().subscribe({
      next: (res: any) => {
        this.selectedRole = 1
        this.roles = res.data;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
      },
    });
  }
  updateRole(){
    const data={
      team_id:this.teamId,
      user_id:this.memberDetails.id,
      role_id:this.selectedRole
    }
    this.documentService.changeTeamUserRole(data).subscribe({
      next:(res)=>{
        this.documentService.emitClickEvent('update-team');
        this.documentService.emitClickEvent();
      },error:(err)=>{

      }
    })
  }

}
