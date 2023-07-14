import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DocumentService } from '../../../services/document.service';

@Component({
  selector: 'app-teammate-detail',
  templateUrl: './teammate-detail.component.html',
  styleUrls: ['./teammate-detail.component.scss'],
})
export class TeammateDetailComponent {
  teamDetailList: any;
  moveTeamDialogue = false;
  shareDialogue = false;
  teamDetail: any;
  teamName: any
  docListView = false;
  sortingMenu = false;
  sortingOption: any;
  selectedDocId: any
  selectedDocSlug: any
  menuIndex = -1;
  cardMenu = false;
  selectedUserId: any;
  selectedTeamId: any;
  statsData: any;
  subscription: Subscription;
  selectedDocUsers:any
  constructor(
    public documentService: DocumentService,
    private toastr: ToastrService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private _clipboardService: ClipboardService
  ) {
    this.subscription = this.documentService.click$.subscribe((res: any) => {
      if (res === 'move') {
        this.moveTeamDialogue = false;
        // this.getAllDocuments();
      } else if (res === 'share') {
        this.shareDialogue = false;
      }else if(res === 'profile-update' || res === 'update-team'){
        this.activatedRoute.params.subscribe((parameter: any) => {
          this.selectedUserId = parameter.id;
          this.selectedTeamId = parameter.id;
          if (parameter.teamId) {
            this.getTeamDetails(parameter.teamId);
            this.getStats(parameter.teamId)
          }
        });
      }
      else {
        // this.inviteTeammateDialogue = false;
      }
    });
  }
  ngOnInit() {
    this.activatedRoute.params.subscribe((parameter: any) => {
      this.selectedUserId = parameter.id;
      this.selectedTeamId = parameter.id;
      if (parameter.teamId) {
        this.getTeamDetails(parameter.teamId);
        this.getStats(parameter.teamId)
      }
    });


  }
  getTeamDetails(id: any) {
    this.documentService.getTeamDetailsById(id).subscribe({
      next: (res: any) => {
        this.teamName = res.data.team_name
        this.teamDetailList = res.data.members;
        this.teamDetail = this.teamDetailList.find(
          (a: any) => a.id == this.selectedUserId
        );
      },
      error: (err) => { },
    });
  }
  getOwnerEmail(data: any) {
    if (data) {
      let ownerData = data.find((arr: any) => arr.is_owner === 'Yes');
      return ownerData.member.email;
    }
  }
  getFavoriteDoc(data:any){
    let userId=localStorage.getItem("id")
    let docDetails=data.find((arr:any)=>arr.user_id==userId)
    return docDetails==undefined?false:true
  }
  copyToClipboard(id: any) {
    // this.clipboard.copy
    this._clipboardService.copy(
      `https://kopist.zehntech.net/dashboard/editor/${id}`
    );
    this.toastr.success("You have successfully copied")
  }
  addTofavorite(data: any) {
    this.documentService.addTofavorite(data.id).subscribe({
      next: (res) => {
        // data.favourite_document.length = 1
        // data.favourite_document.push({user_id:2})
        this.ngOnInit()
        this.toastr.success('Successfully added to favorite');
      },
      error: (err) => {
        this.toastr.success(err.message);
      },
    });
  }
  removeFavorite(data:any){
    this.documentService.removeTofavorite(data.id).subscribe({
      next: (res) => {
        // data.favourite_document.length = 0
        this.ngOnInit()
        this.toastr.success('Successfully removed from favorite');
      },
      error: (err) => {
        this.toastr.success(err.message);
      },
    });
  }
  moveToTeam(documentId: any) {
    const data = {
      document_id: documentId,
      team_id: 123,
    };
    this.documentService.moveToTeam(data).subscribe({
      next: (res) => {
        this.toastr.success('Successfully moved to team');
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }
  duplicateDocument(id: any) {
    this.documentService.duplicateDocument(id).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }
  deleteDocuments(index: number, id: number, event: any) {
    event.preventDefault();
    this.documentService.deleteDocument(id).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.teamDetail?.documents.splice(index, 1);
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }
  getOwnerName(data: any) {
    let ownerData = data.find((arr: any) => arr.is_owner === 'Yes');
    return ownerData.member.first_name;
  }
  getStats(id: any) {
    this.documentService.getTeamstats(id).subscribe({
      next: (res) => {
        this.statsData = res.data;
      },
      error: (err) => { },
    });
  }

  sortItems(type: string) {
    this.sortingOption = type;
    this.teamDetail?.documents.sort((a: any, b: any) => {
      if (type == 'alphabetical') {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        } else if (nameA > nameB) {
          return 1;
        }
        return 0;
      } else if (type == 'create') {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);

        return dateB.getTime() - dateA.getTime();
      } else if (type == 'update') {
        const dateA = new Date(a.updated_at);
        const dateB = new Date(b.updated_at);

        return dateB.getTime() - dateA.getTime();
      } else if (type == 'view') {
        const viewA = a.views;
        const viewB = b.views;

        return viewB - viewA;
      } else {
        return;
      }
    })


  }

  closeMenu(index:number){
    if (this.cardMenu && index == this.menuIndex) {
      this.cardMenu = false;
    }
  }
  closeSortMenu(){
    if (this.sortingMenu) {
      this.sortingMenu = false;
    }
  }
}
