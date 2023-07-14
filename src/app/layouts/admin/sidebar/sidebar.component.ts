import {Component} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {DocumentService} from '../../../services/document.service';
import {Subscription} from 'rxjs';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  myDocumentsIndex = -1;
  shareDocumentsIndex = -1;
  privateIndex = -1;
  activeMenu = ""
  myDocumentsFolders: any = ['Created by me', 'Favorites', 'Shared with me'];
  shareDocumentsFolders: any = ['Unsorted', 'Sorted', 'New Folder'];
  privateDocumentsFolders: any = ['Unsorted', 'Sorted', 'New Folder'];
  documentsMenu: boolean = false;
  myDocumentsMenu: boolean = false;
  shareDocumentsMenu: boolean = false;
  privateDocumentsMenu: boolean = false;
  sidebarItem: boolean = false;
  teamMenu: boolean = false;
  myTeams: any[] = [];
  targetId = 'teamDropdown';
  inviteTeammateDialogue: boolean = false;
  myDefaultTeam: any;
  name: any;
  subscription: Subscription;
  fullName: any;
  createTeamDialogue: boolean = false;
  teamSettingDialogue: boolean = false;

  constructor(
    public documentService: DocumentService,
    public authService: AuthService,
    public route: Router,
    public toasterService: ToastrService,
    private oidcSecurityService: OidcSecurityService
  ) {
    this.subscription = this.documentService.click$.subscribe((res) => {
      if (res == 'default-change') {
        this.getDefaultTeams();
      } else {
        this.getDefaultTeams();
        this.createTeamDialogue = false;
        this.teamSettingDialogue = false;
        this.inviteTeammateDialogue = false;
        this.getTeam();
      }

    });
  }

  ngOnInit() {
    this.getTeam();
    this.getDefaultTeams();
    this.name = localStorage.getItem('name');
    this.fullName = localStorage.getItem('full-name');

    this.route.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.sidebarItem && !event.url.startsWith('/dashboard/editor')) {
          this.autoLayout();
        } else if (event.url.startsWith('/dashboard/editor')) {
          this.sidebarItem = false;
        }
      }
    });
  }

  getTeam() {
    this.documentService.getTeams().subscribe({
      next: (res) => {
        this.myTeams = res.data.data;
      },
      error: (err) => {
      },
    });
  }

  getDefaultTeams() {
    this.documentService.getDefaultTeams().subscribe({
      next: (res) => {
        this.myDefaultTeam = res.data;
        this.sendTokenToChromeExtension({
          extensionId: 'nnindblljkmlneohokfekacghdepmial',
          teamId: this.myDefaultTeam.id,
        });
      },
      error: (err) => {
        // this.toasterService.error(err.error.message);
      },
    });
  }

  setDefault(id: any) {
    this.documentService.setDefaultTeams(id).subscribe({
      next: (res) => {
        this.sendTokenToChromeExtension({
          extensionId: 'nnindblljkmlneohokfekacghdepmial',
          teamId: res.data.id,
        });
        this.documentService.emitClickEvent('team-change');
        this.documentService.emitChangeTeamEvent();
        this.getDefaultTeams();
        this.teamMenu = false;
      },
      error: (err) => {
        err.error.message;
      },
    });
  }

  logoutToChromeExtension({extensionId, msg}: any) {
    // chrome.runtime.sendMessage(extensionId, {msg}, (response) => {
    //   if (!response.success) {
    //     // console.log('error sending message', response);
    //     return response;
    //   }
    //   // console.log('Sucesss ::: ', response.message);
    // });
  }

  sendTokenToChromeExtension({extensionId, teamId}: any) {
    try {
      // chrome.runtime.sendMessage(
      //   'nnindblljkmlneohokfekacghdepmial',
      //   {action: 'checkInstalled'},
      //   (response: any) => {
      //     if (response) {
      //       chrome.runtime.sendMessage(
      //         extensionId,
      //         {teamId},
      //         (response: any) => {
      //           if (!response.success) {
      //             // console.log('error sending message', response);
      //             return response;
      //           }
      //           // console.log('Sucesss ::: ', response.message);
      //         }
      //       );
      //     } else {
      //     }
      //   }
      // );
    } catch (error) {
    }
  }

  openNav() {
    const sidebar: any = document.querySelector('aside');
    const logo: any = document?.querySelector('.logo');
    const teamName: any = document?.querySelector('.team-name');
    const content: any = document?.querySelector('.content');
    if (sidebar) {
      if (sidebar.classList.contains('w-28')) {
        sidebar.classList.remove('w-28');
        sidebar.classList.add('w-64');
        this.sidebarItem = true;
        if (logo) {
          logo.classList.remove('logo-margin');
          logo.classList.add('ml-[254px]');
          logo.classList.add('pl-2.5');
        }
        if (teamName) {
          teamName.classList.remove('ml-[44px]');
          teamName.classList.add('ml-[208px]');
        }
        if (content) {
          content.classList.remove('ml-14');
          content.classList.remove('ml-[75px]');
          content.classList.add('ml-14', 'ml-[236px]');
        }
      } else {
        // mini sidebar
        sidebar.classList.add('w-28');
        sidebar.classList.remove('w-64');
        this.sidebarItem = false;
        if (logo) {
          logo.classList.add('logo-margin');
          logo.classList.remove('ml-[236px]');
          logo.classList.remove('pl-2.5');
        }
        if (teamName) {
          teamName.classList.add('ml-[44px]');
          teamName.classList.remove('ml-[208px]');
        }
        if (content) {
          content.classList.remove('ml-14', 'ml-[236px]');
          content.classList.add('ml-[75px]');
        }
      }
    }
  }

  autoLayout() {
    const sidebar: any = document.querySelector('aside');
    const logo: any = document?.querySelector('.logo');
    const teamName: any = document?.querySelector('.team-name');
    const content: any = document?.querySelector('.content');
    if (sidebar) {
      sidebar.classList.remove('w-28');
      sidebar.classList.add('w-64');
      this.sidebarItem = true;
      if (logo) {
        logo.classList.remove('logo-margin');
        logo.classList.add('ml-[254px]');
        logo.classList.add('pl-2.5');
      }
      if (teamName) {
        teamName.classList.remove('ml-[44px]');
        teamName.classList.add('ml-[208px]');
      }
      if (content) {
        content.classList.remove('ml-14');
        content.classList.remove('ml-[75px]');
        content.classList.add('ml-14', 'ml-[236px]');
      }
    }
  }

  logout() {
    let provider = localStorage.getItem('provider');
    this.sidebarItem = false;
    if (provider == 'GOOGLE') {
      this.oidcSecurityService.revokeAccessToken().subscribe((res: any) => {
        localStorage.clear();
        sessionStorage.clear();
        this.checkExtensionInstalledLogout();
        this.route.navigate(['/']);
      })
      this.oidcSecurityService.logoff().subscribe((result) => {
        localStorage.clear();
        sessionStorage.clear();
        this.checkExtensionInstalledLogout();
        this.route.navigate(['/']);
      });
    } else {
      localStorage.clear();
      sessionStorage.clear();
      this.checkExtensionInstalledLogout();
      this.route.navigate(['/']);
    }

  }

  createTeam() {
    this.createTeamDialogue = true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  opneTeamSetting() {
    this.teamSettingDialogue = true;
  }

  changeDocumentStep(step: any) {
    this.activeMenu = step
    this.documentService.emitChangeDocumentStepEvent(step);
    localStorage.setItem('step', step);
  }

  checkExtensionInstalledLogout() {
    try {
      // chrome.runtime.sendMessage(
      //   'nnindblljkmlneohokfekacghdepmial',
      //   {action: 'checkInstalled'},
      //   (response) => {
      //     if (response) {
      //       this.logoutToChromeExtension({
      //         extensionId: 'nnindblljkmlneohokfekacghdepmial',
      //         msg: 'logout',
      //       });
      //       // The extension is installed.
      //     } else {
      //       // The extension is not installed.
      //     }
      //   }
      // );
    } catch (error) {
      console.log('Not Installed');
    }
  }

  closeMenu() {
    if (this.teamMenu) {
      this.teamMenu = false;
    }
  }
}
