import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DocumentService } from '../../../services/document.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  notifyTab:boolean = false
  notifications:any
  teamActivity:any
  myDefaultTeam: any;
  constructor(public documentService:DocumentService,public toasterService :ToastrService){}

  ngOnInit() {
    this.myNotifications();
    this.getDefaultTeams();
  }


  myNotifications(){
    this.documentService.getActivity().subscribe((res:any)=>{
      this.notifications = res.data
    })
  }
  allTeamActivity(teamId:any){
    this.documentService.getTeamActivity().subscribe((res:any)=>{
      this.teamActivity = res.data.find(({ id }:any) => id === teamId)
    })
  }

  getDefaultTeams() {
    this.documentService.getDefaultTeams().subscribe({
      next: (res) => {
        this.myDefaultTeam = res.data;
        this.allTeamActivity(this.myDefaultTeam.id)
      },
      error: (err) => {
        // this.toasterService.error(err.error.message);
      },
    });
  }
}
