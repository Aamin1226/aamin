import { ChangeDetectorRef, Component } from '@angular/core';
import { DocumentService } from '../../../services/document.service';

@Component({
  selector: 'app-start-new',
  templateUrl: './start-new.component.html',
  styleUrls: ['./start-new.component.scss'],
})
export class StartNewComponent {
  allTabs: any;

  constructor(
    public documentService: DocumentService,
    private ref: ChangeDetectorRef
  ) {}

  closeModal() {
    this.documentService.emitClickEvent();
  }

  ngOnInit() {
    this.checkExtensionInstalled();
  }

  checkExtensionInstalled() {
    try {
      // chrome.runtime.sendMessage(
      //   'nnindblljkmlneohokfekacghdepmial',
      //   { action: 'checkInstalled' },
      //   (response) => {
      //     if (response) {
      //       this.getAllTabs({
      //         extensionId: 'nnindblljkmlneohokfekacghdepmial',
      //         msg: 'getTabDetails',
      //       });
      //       // The extension is installed.
      //     } else {
      //       // The extension is not installed.
      //     }
      //   }
      // );
    } catch (error) {
      console.log(error);
    }
  }

  getAllTabs({ extensionId, msg }: any) {
    // chrome.runtime.sendMessage(extensionId, { msg }, (response) => {
    //   if (response && response.tabDetails) {
    //     const filteredData = response.tabDetails.filter((obj: any) => {
    //       const url = obj.url.toLowerCase();
    //       return !url.startsWith('chrome') && !url.startsWith('https://chrome');
    //     });
    //     this.allTabs = filteredData;
    //     console.log(this.allTabs)
    //     //  this.allTabs = [...this.allTabs];
    //     this.ref.detectChanges();
    //   } else {
    //     console.log('error');
    //   }
    // });
  }

  redirectToTab(tabId: any, windowId: any,url:any) {
    // chrome.runtime.sendMessage(
    //   'nnindblljkmlneohokfekacghdepmial',
    //   { msg: 'selectTab', tabId: tabId, windowId: windowId,url:url },
    //   (response) => {
    //     if (response == 'startedOnTab') {
    //       this.closeModal();
    //     } else {
    //       console.log('Recording has not started');
    //     }
    //   }
    // );
  }
}
