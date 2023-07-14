import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DocumentService } from '../../../services/document.service';

@Component({
  selector: 'app-teammates',
  templateUrl: './teammates.component.html',
  styleUrls: ['./teammates.component.scss'],
})
export class TeammatesComponent {
  inviteTeammateDialogue: boolean = false;
  changeRoleDialogue: boolean = false;
  sidebarItem: boolean = false;
  memberDetail:any 
  myTeams: any[] = [];
  colorClass: any = ['round-1', 'round-2', 'round-3', 'round-4']
  subscription: Subscription;
  teamChanged!: Subscription;
  myDefaultTeam: any;
  cardMenu: boolean = false;
  menubtn: boolean = false;
  menuIndex: number = -1;
  constructor(
    public documentService: DocumentService,
    public route: Router,
    public toasterService: ToastrService
  ) {
    this.subscription = this.documentService.click$.subscribe((res:any) => {
      if(res == 'profile-update' || res == 'update-team'){
        this.getDefaultTeams()
      }else {
        this.inviteTeammateDialogue = false;
        this.changeRoleDialogue = false;
      }
     
    });
  }

  ngOnInit() {
    // this.getTeam();

    this.getDefaultTeams();
    this.teamChanged = this.documentService.changeTeam$.subscribe(() => {
      this.getDefaultTeams();
      // this.inviteTeammateDialogue = false;
    });
  }
  getTeam(id: any) {
    this.documentService.getTeamDetailsById(id).subscribe({
      next: (res: any) => {
        this.myTeams = res.data.members;
        this.myTeams.map(myTeams => {
          myTeams.color = this.colorClass[Math.floor(Math.random() * this.colorClass.length)];
          return myTeams;
        });

      },
      error: (err) => { },
    });
  }
  getDefaultTeams() {
    this.documentService.getDefaultTeams().subscribe({
      next: (res) => {
        this.myDefaultTeam = res.data;
        this.getTeam(this.myDefaultTeam.id)
      },
      error: (err) => {
        // this.toasterService.error(err.error.message);
      },
    });
  }
  getOwnerName(data: any) {
    let ownerData = data.find((arr: any) => arr.is_owner === 'Yes');
    return ownerData.status;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.teamChanged.unsubscribe()
  }

  deleteMember(userId: any, teamId: any) {
    this.documentService.deleteMember(userId, teamId).subscribe({
      next: (res) => {
        this.getTeam(this.myDefaultTeam.id)
        this.toasterService.success(res.message);
      },
      error: (err) => {
        this.toasterService.error(err.error.message);
      },
    });
  }

}
