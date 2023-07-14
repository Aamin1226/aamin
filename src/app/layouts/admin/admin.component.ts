import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {delay} from 'rxjs/operators';
import {LoadingService} from '../../services/loading.service';
import {DocumentService} from '../../services/document.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  questionAvailable: boolean = false;
  defaultTeamAvailable: boolean = true;
  loading: boolean = false;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public authService: AuthService,
    private loadingService: LoadingService,
    private documentService: DocumentService
  ) {
  }

  ngOnInit() {
    this.listenToLoading();
    this.getPersonalize();
    this.getDefaultTeams();
    this.route.params.subscribe((res) => {
    });
  }

  listenToLoading(): void {
    this.loadingService.loadingSub
      .pipe(delay(0))
      .subscribe((loading) => {
        this.loading = loading;
      });
  }

  getPersonalize() {
    this.authService.getPersonalizeQuestions().subscribe({
      next: (res) => {
        res.data.length == 0
          ? (this.questionAvailable = true)
          : (this.questionAvailable = false);
      },
      error: (err) => {
      },
    });
  }

  getDefaultTeams() {
    this.documentService.getDefaultTeams().subscribe({
      next: (res) => {
        this.defaultTeamAvailable = true;
      },
      error: (err) => {
        console.log(err.error.message);
        if (err.error.message == 'Default team not found') {
          this.getTeam();
        }
        // this.toasterService.error(err.error.message);
      },
    });
  }

  displayCounter(count: any) {
    this.questionAvailable = false
    this.defaultTeamAvailable = true
  }


  isEditorRoute(): boolean {
    return this.router.url.startsWith('/dashboard/editor');
  }

  isNavbarRoute(): boolean {
    return this.router.url == (('/dashboard')) || this.router.url.startsWith('/dashboard/documents') || this.router.url.startsWith('/dashboard/editor');
  }

  getTeam() {
    this.documentService.getTeams().subscribe({
      next: (res) => {
        if (res.data.data.length >= 0) {
          this.setDefault(res.data.data[0].id)
        } else {
          this.defaultTeamAvailable = false;
        }
        ;
      },
      error: (err) => {
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
        this.documentService.emitClickEvent('default-change');
        this.documentService.emitChangeTeamEvent();
        // this.getDefaultTeams();
      },
      error: (err) => {
        err.error.message;
      },
    });
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

}
