import { Component } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DocumentService } from '../../services/document.service';
import { ElectronService } from '../../core/services/electron/electron.service';
// import {Clipboard} from '@angular/cdk/clipboard';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent {
  documents: any;
  docListView:boolean = false;
  statsData: any;
  cardMenu: boolean = false;
  startNewDialogue: boolean = false;
  menuIndex: number = -1;
  myDefaultTeam: any;
  myTeams: any;
  inviteTeammateDialogue: boolean = false;
  moveTeamDialogue: boolean = false;
  shareDialogue: boolean = false;
  subscription: Subscription;
  selectedDocId: any
  selectedDocSlug: any
  extensionInstalled:boolean = false;
  notifyTab:boolean = false
  notifications: any;
  teamActivity: any;
  selectedDocUsers: any;
  allTabs: any;
  statistics: any = [
    {
      name: 'Total Created',
      icon: 'assets/dashboardicons/stat1.png',
      data: 0
    },
    {
      name: 'Total Views',
      icon: 'assets/dashboardicons/stat2.png',
      data: 0

    }
    ,
    {
      name: 'Total Reactions',
      icon: 'assets/dashboardicons/stat3.png',
      data: 0
    }
  ];
  constructor(
    public documentService: DocumentService,
    private toastr: ToastrService,
    private electronService: ElectronService,
    private clipboardService: ClipboardService // private clipboard: Clipboard
  ) {
    this.subscription = this.documentService.click$.subscribe((res: any) => {
      if (res === 'move') {
        this.moveTeamDialogue = false;
        this.getAllDocuments();
      } else if (res === 'share') {
        this.shareDialogue = false;
        this.getAllDocuments();
      }else if(res == 'profile-update' || res == 'update-team'){
        this.getTeam();
        this.getAllDocuments();
      }else if(res === 'team-change'){
        this.getDefaultTeams();
      }
      else {
        this.inviteTeammateDialogue = false;
        this.startNewDialogue = false;
      }
    });
  }
  ngOnInit() {
    this.getAllDocuments();
    this.getDefaultTeams();
    this.myNotifications();
    this.checkExtensionInstalled();
  }

  copyToClipboard(id: any) {
    // this.clipboard.copy
    this.clipboardService.copy(
      `https://kopist.zehntech.net/dashboard/editor/${id}`
    );
    this.toastr.success("You have successfully copied");
  }
  getAllDocuments() {
    this.documentService.getAllDocuments("active", 8).subscribe({
      next: (res) => {
        this.documents = res.data.data;
      },
      error: (err) => { },
    });
  }
  getDefaultTeams() {
    this.documentService.getDefaultTeams().subscribe({
      next: (res) => {
        this.myDefaultTeam = res.data;
        this.allTeamActivity(this.myDefaultTeam.id)
        this.getStats(this.myDefaultTeam.id)
        this.getTeam()
      },
      error: (err) => {

        // this.toastr.error(err.error.message);
      },
    });
  }
  getTeam() {
    this.documentService.getTeamDetailsById(this.myDefaultTeam.id).subscribe({
      next: (res: any) => {
        this.myTeams = res.data.members;

      },
      error: (err) => { },
    });
  }
  getStats(id: any) {
    this.documentService.getMystats().subscribe({
      next: (res) => {
        this.statsData = res.data;
        this.statistics[0].data = this.statsData.totalDocuments
        this.statistics[1].data = this.statsData.totalDocumentViews
        this.statistics[2].data = this.statsData.totalReactions
      },
      error: (err) => { },
    });
  }


  deleteDocuments(index: number, id: number, event: any) {
    event.preventDefault();
    this.documentService.deleteDocument(id).subscribe({
      next: (res) => {
        this.documents.splice(index, 1);
      },
      error: (err) => { },
    });
  }

  getOwnerName(data: any) {
    let ownerData = data.find((arr: any) => arr.is_owner === 'Yes');

    return ownerData.users.first_name;
  }
  getFavoriteDoc(data:any){
    let userId=localStorage.getItem("id")
    let docDetails=data.find((arr:any)=>arr.user_id==userId)
    return docDetails==undefined?false:true
  }
  duplicateDocument(id: any) {
    this.documentService.duplicateDocument(id).subscribe({
      next: (res) => {
        this.getAllDocuments();
        this.toastr.success(res.message);
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }

  addTofavorite(data: any) {
    this.documentService.addTofavorite(data.id).subscribe({
      next: (res) => {
        // data.favourite_document.length = 1
        // data.favourite_document.push({user_id:2})
        this.getAllDocuments();
        this.toastr.success('Successfully added to favorite');
      },
      error: (err) => {

        this.toastr.success(err.message);
      },
    });

    // if (data.favourite_document.length == 0) {

    // } else {

    // }
  }
  removeFavorite(data:any){
    this.documentService.removeTofavorite(data.id).subscribe({
      next: (res) => {

        this.getAllDocuments();
        this.toastr.success('Successfully removed from favorite');
      },
      error: (err) => {
        this.toastr.success(err.message);
      },
    });
  }
  checkExtensionInstalled() {
    try {
      // chrome.runtime.sendMessage('nnindblljkmlneohokfekacghdepmial', { action: 'checkInstalled' }, (response) => {
      //   if (response) {
      //     this.extensionInstalled = true;
      //     // this.getAllTabs({ extensionId: 'nnindblljkmlneohokfekacghdepmial', msg: 'getTabDetails' })
      //     // The extension is installed.
      //   } else {
      //     this.extensionInstalled = false;
      //     // The extension is not installed.
      //   }
      // });
    } catch (error) {
      console.log(error);
    }

  }

  // getAllTabs({ extensionId, msg }: any) {
  //   chrome.runtime.sendMessage(extensionId, { msg }, response => {
  //     if (response && response.tabDetails) {
  //       const filteredData = response.tabDetails.filter((obj: any) => {
  //         const url = obj.url.toLowerCase();
  //         return !url.startsWith('chrome') && !url.startsWith('https://chrome');
  //         });

  //       this.allTabs = filteredData
  //       this.startNewDialogue=true

  //     } else {
  //       console.log('error');
  //     }
  //   });
  // }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closeMenu(index:number){
    if (this.cardMenu && index == this.menuIndex) {
      this.cardMenu = false;
    }
  }

  myNotifications(){
    this.documentService.getActivity().subscribe((res: any)=>{
      this.notifications = res.data.slice(0,3);
    })
  }

  allTeamActivity(teamId:any){
    this.documentService.getTeamActivity().subscribe((res: any)=>{
      this.teamActivity = res.data.find(({ id }: any) => id === teamId);
    })
  }

  redirectToChromeStore(){
    window.open('https://chrome.google.com/webstore');
  }

  sendMessageToMain(){
    if (this.electronService.isElectron) {
      const message = 'startCapturing';
      this.electronService.ipcRenderer.send('messageToMain', message);
    }
  }

}
