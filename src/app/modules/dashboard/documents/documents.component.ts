import { Component } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DocumentService } from '../../../services/document.service';
import { ElectronService } from '../../../core/services';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent {
  documents: any;
  Breadcrumb: any = 'My Documents';
  breadcrumbIcon: any = 'doc';
  myDefaultTeam: any;
  showEmpty:boolean = false;
  menuIndex:number = -1;
  sortingMenu:boolean = false;
  sortingOption:any;
  cardMenu:boolean = false;
  moveTeamDialogue: boolean = false;
  startNewDialogue: boolean = false;
  selectedDocId:any
  selectedDocSlug:any
  extensionInstalled:boolean = false;
  docListView:boolean = false;
  shareDialogue: boolean = false;
  subscription: Subscription;
  selectedDocUsers:any
  constructor(
    public documentService: DocumentService,
    public electronService: ElectronService,
    public toasterService: ToastrService,
    private _clipboardService: ClipboardService
  ) {
    this.subscription = this.documentService.click$.subscribe((res:any) => {
      if (res == 'move') {
        this.moveTeamDialogue = false;
      }else if(res == 'share'){
        this.shareDialogue = false;
        this.getAllDocumentsData()
      }else if(res == 'profile-update' || res == 'update-team'){
        this.getAllDocumentsData()
      }
      else {
        this.startNewDialogue = false;
      }
    });
  }
  ngOnInit() {
    // this.getAllDocuments('active');
    this.getAllDocumentsData()
    this.checkExtensionInstalled();
  }
  getDefaultTeams() {
    this.documentService.getDefaultTeams().subscribe({
      next: (res) => {
        this.myDefaultTeam = res.data;
      this.getSharedDocsWithTeam();

      },
      error: (err) => {
        // this.toasterService.error(err.error.message);
      },
    });
  }
  getAllDocuments(type: any,favourite?:boolean) {

    this.documentService.getAllDocuments(type, 1000000).subscribe({
      next: (res) => {
        this.showEmpty = true;
        this.documents = res.data.data;
        let userId=localStorage.getItem("id")
        this.documents=this.documents.filter((item:any) => item.doument_users.some((doc:any) => doc.user_id == userId &&doc.is_owner=="Yes"));
        if(favourite === true){
          // this.documents = this.documents.filter((obj: any) => {
          //   const hasEmptyArray = obj.favourite_document.length === 0
          //   return !hasEmptyArray;
          // });
          let userId=localStorage.getItem("id")
          this.documents=res.data.data.filter((item:any) => item.favourite_document.some((doc:any) => doc.user_id == userId));

        }
        if(this.sortingOption){
          this.sortItems(this.sortingOption)
        }
      },
      error: (err) => {},
    });
  }
  getOwnerName(data: any) {
    let ownerData = data.find((arr: any) => arr.is_owner === 'Yes');
    return (ownerData.users.first_name +" "+ ownerData.users.last_name);
  }
  getFavoriteDoc(data:any){
    let userId=localStorage.getItem("id")

    let docDetails=data.find((arr:any)=>arr.user_id==userId)

    return docDetails==undefined?false:true
  }
  duplicateDocument(id: any) {
    this.documentService.duplicateDocument(id).subscribe({
      next: (res) => {
        this.showEmpty = true;
        this.getAllDocuments('active');
        this.toasterService.success(res.message);
      },
      error: (err) => {
        this.toasterService.error(err.message);
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
        this.toasterService.success('Successfully moved to team');
      },
      error: (err) => {
        this.toasterService.error(err.message);
      },
    });
  }
  addTofavorite(data: any) {
    this.documentService.addTofavorite(data.id).subscribe({
      next: (res) => {

        if (this.Breadcrumb == 'Favorites') {
          this.breadcrumbIcon = 'doc'
          this.getAllDocuments('active',true);
        } else if (this.Breadcrumb == 'Shared with me') {
          this.breadcrumbIcon = 'doc'
          this.getMySharedDocs();
        } else if (this.Breadcrumb == 'Private') {
          this.breadcrumbIcon = 'private'
          this.getMyPrivateDocs();
        } else if (this.Breadcrumb == 'Trash') {
          this.breadcrumbIcon = 'trash'
          this.getAllDocuments('trashed ');
        } else if (this.Breadcrumb == 'Created by me') {
          this.breadcrumbIcon = 'doc'
          this.getAllDocuments('active');
        } else if (this.Breadcrumb == 'My Documents') {
          this.breadcrumbIcon = 'doc'
          this.getAllDocuments('active');
        } else if (this.Breadcrumb == 'Shared with Team') {
          this.breadcrumbIcon = 'share-team'
          // this.Breadcrumb = 'Shared with Team';
          this.getSharedDocsWithTeam();
        }
        this.toasterService.success('Successfully added to favorite');
      },
      error: (err) => {
        this.toasterService.success(err.message);
      },
    });

  }
  removeFavorite(data:any){
    this.documentService.removeTofavorite(data.id).subscribe({
      next: (res) => {
        if (this.Breadcrumb == 'Favorites') {
          this.breadcrumbIcon = 'doc'
          this.getAllDocuments('active',true);
        } else if (this.Breadcrumb == 'Shared with me') {
          this.breadcrumbIcon = 'doc'
          this.getMySharedDocs();
        } else if (this.Breadcrumb == 'Private') {
          this.breadcrumbIcon = 'private'
          this.getMyPrivateDocs();
        } else if (this.Breadcrumb == 'Trash') {
          this.breadcrumbIcon = 'trash'
          this.getAllDocuments('trashed ');
        } else if (this.Breadcrumb == 'Created by me') {
          this.breadcrumbIcon = 'doc'
          this.getAllDocuments('active');
        } else if (this.Breadcrumb == 'My Documents') {
          this.breadcrumbIcon = 'doc'
          this.getAllDocuments('active');
        } else if (this.Breadcrumb == 'Shared with Team') {
          this.breadcrumbIcon = 'share-team'
          // this.Breadcrumb = 'Shared with Team';
          this.getSharedDocsWithTeam();
        }
        this.toasterService.success('Successfully removed from favorite');
      },
      error: (err) => {
        this.toasterService.success(err.message);
      },
    });
  }
  deleteDocuments(index: number, id: number, event: any) {
    event.preventDefault();
    this.documentService.deleteDocument(id).subscribe({
      next: (res) => {
        this.showEmpty = true;
        this.documents.splice(index, 1);
      },
      error: (err) => {},
    });
  }
  copyToClipboard(id: any) {
    // this.clipboard.copy
    this._clipboardService.copy(
      `https://kopist.zehntech.net/dashboard/editor/${id}`
    );
    this.toasterService.success('You have successfully copied');
  }
  getMyFavorite() {
    // this.documentService.getMyFavoriteDocs().subscribe({
    //   next: (res) => {
    //     // this.documents = res.data.data;
    //   },
    //   error: (err) => {},
    // });
    this.showEmpty = true;
    this.documents = this.documents.filter((obj: any) => {
      const hasEmptyArray = obj.favourite_document.length === 0
      return !hasEmptyArray;
    });
  }
  getMySharedDocs() {
    this.documentService.getMySharedDocs().subscribe({
      next: (res) => {
        this.showEmpty = true;
        this.documents = res.data && res.data.data  ? res.data.data  : []
      },
      error: (err) => {},
    });
  }
  getMyPrivateDocs() {
    this.documentService.getMyPrivateDocs().subscribe({
      next: (res) => {
        this.showEmpty = true;
        this.documents = res.data.data;
      },
      error: (err) => {},
    });
  }
  getSharedDocsWithTeam() {
    this.documentService.getSharedWithDocument(this.myDefaultTeam.id).subscribe({
      next: (res: any) => {
        this.showEmpty = true;
        this.documents = res.data.data;
      },
      error: (err) => {
        this.toasterService.error(err.error.message);
      },
    });
  }

  sortItems(type:string){
    this.sortingOption = type;
    this.documents.sort((a:any, b:any) => {
      if(type == 'alphabetical'){
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          } else if (nameA > nameB) {
            return 1;
          }
          return 0;
      }else if(type == 'create'){
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);

          return dateB.getTime() - dateA.getTime();
      }else if(type == 'update'){
          const dateA = new Date(a.updated_at);
          const dateB = new Date(b.updated_at);

          return dateB.getTime() - dateA.getTime();
      }else if(type == 'view'){
          const viewA = a.views;
          const viewB = b.views;

          return viewB - viewA;
      }else{
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


  getAllDocumentsData(){
    this.Breadcrumb = localStorage.getItem('step')
    ? localStorage.getItem('step')
    : 'My Documents';
  if (this.Breadcrumb == 'Favorites') {
    this.breadcrumbIcon = 'doc'
    this.getAllDocuments('active',true);
  } else if (this.Breadcrumb == 'Shared with me') {
    this.breadcrumbIcon = 'doc'
    this.getMySharedDocs();
  } else if (this.Breadcrumb == 'Private') {
    this.breadcrumbIcon = 'private'
    this.getMyPrivateDocs();
  } else if (this.Breadcrumb == 'Trash') {
    this.breadcrumbIcon = 'trash'
    this.getAllDocuments('trashed ');
  } else if (this.Breadcrumb == 'Created by me') {
    this.breadcrumbIcon = 'doc'
    this.getAllDocuments('active');
  } else if (this.Breadcrumb == 'My Documents') {
    this.breadcrumbIcon = 'doc'
    this.getAllDocuments('active');
  } else if (this.Breadcrumb == 'Shared with Team') {
    this.breadcrumbIcon = 'share-team'
    // this.Breadcrumb = 'Shared with Team';
    this.getDefaultTeams();
  }
  this.documentService.changeDocumentStep$.subscribe({
    next: (res: any) => {
      if (res == 'Favorites') {
        this.breadcrumbIcon = 'doc'
        this.Breadcrumb = res;
        this.getAllDocuments('active',true);
      } else if (res == 'Shared with me') {
        this.breadcrumbIcon = 'doc'
        this.Breadcrumb = res;
        this.getMySharedDocs();
      } else if (res == 'Private') {
        this.breadcrumbIcon = 'private'
        this.Breadcrumb = res;
        this.getMyPrivateDocs();
      } else if (res == 'Trash') {
        this.breadcrumbIcon = 'trash'
        this.Breadcrumb = res;
        this.getAllDocuments('trashed');
      } else if (res == 'Created by me') {
        this.breadcrumbIcon = 'doc'
        this.Breadcrumb = 'My Documents';
        this.getAllDocuments('active');
      } else if (res == 'Shared with Team') {
        this.breadcrumbIcon = 'share-team'
        this.Breadcrumb = 'Shared with Team';
        this.getSharedDocsWithTeam();
      }
    },
    error: (err) => {
      console.log(err.error.message);
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

  redirectToChromeStore(){
    window.open("https://chrome.google.com/webstore");
  }

  sendMessageToMain(){
    if (this.electronService.isElectron) {
      const message = 'startCapturing';
      this.electronService.ipcRenderer.send('messageToMain', message);
    }
  }
}
