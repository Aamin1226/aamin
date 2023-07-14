import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DocumentService } from '../../../services/document.service';

@Component({
  selector: 'app-move-document',
  templateUrl: './move-document.component.html',
  styleUrls: ['./move-document.component.scss']
})
export class MoveDocumentComponent {
  myTeams: any[] = [];
  yourTeamId: any;
  @Input() docId:any
  constructor(public documentService:DocumentService,private toastr: ToastrService,){}
  ngOnInit(){
    this.getTeam();
  }
  closeModal() {
    this.documentService.emitClickMoveTeam();
  }
  getTeam() {
    this.documentService.getTeams().subscribe({
      next: (res) => {
        this.myTeams = res.data.data;
      },
      error: (err) => {},
    });
  }
  moveToTeam() {
    const data = {
      document_id: this.docId,
      team_id: this.yourTeamId,
    };
    this.documentService.moveToTeam(data).subscribe({
      next: (res) => {
        this.documentService.emitClickMoveTeam();
        this.toastr.success('Successfully moved to team');
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }
}
