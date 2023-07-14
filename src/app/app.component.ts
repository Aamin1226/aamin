import {Component} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kopist-client';
  token: any;
  loading = false;
  name: any;

  constructor() {
  };

  ngOnInit(): void {
    
    this.token = localStorage.getItem('kopist-token');
    this.name = localStorage.getItem('name');

    if (this.token) {
      this.checkExtensionInstalled(this.token, this.name);
    } else {
      this.checkExtensionInstalledLogout();
    }
  }

  checkExtensionInstalled(jwt: any, name: any) {
    try {
      // chrome.runtime.sendMessage('nnindblljkmlneohokfekacghdepmial', {action: 'checkInstalled'}, function (response) {
      //   if (response) {
      //
      //     chrome.runtime.sendMessage('nnindblljkmlneohokfekacghdepmial', {jwt, name}, (response: any) => {
      //       if (!response.success) {
      //         return response;
      //       }
      //     });
      //     // The extension is installed.
      //   } else {
      //     // The extension is not installed.
      //   }
      // });
    } catch (error) {
    }

  }

  logoutToChromeExtension({extensionId, msg}: any) {
    // chrome.runtime.sendMessage(extensionId, {msg}, response => {
    //   if (!response.success) {
    //     // console.log('error sending message', response);
    //     return response;
    //   }
    //   // console.log('Sucesss ::: ', response.message)
    // });
  }

  checkExtensionInstalledLogout() {
    try {
      // chrome.runtime.sendMessage('nnindblljkmlneohokfekacghdepmial', {action: 'checkInstalled'}, (response) => {
      //   if (response) {
      //     this.logoutToChromeExtension({extensionId: 'nnindblljkmlneohokfekacghdepmial', msg: 'logout'})
      //     // The extension is installed.
      //   } else {
      //     // The extension is not installed.
      //   }
      // });
    } catch (error) {
      // console.log('Not Installed');
    }

  }
}
