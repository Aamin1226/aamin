import {Component, HostListener, ElementRef} from '@angular/core';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {DocumentService} from '../../../services/document.service';
import {Location} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  notifyTab: boolean = false
  name: any;
  showSearch: boolean = false;
  showNotification: boolean = false;
  lastName: any;
  myDefaultTeam: any;
  docId: any;
  notifications: any;
  targetId = 'notificationDropdown';
  private history: string[] = [];
  teamActivity: any;
  documentData: any;
  isFavorite: boolean = false;
  profileImage: any;
  editProfilePageEnabled!: boolean;
  subscription: Subscription;
  searchData: any;

  constructor(public router: Router, public location: Location, private documentService: DocumentService, private elementRef: ElementRef, public route: ActivatedRoute, private toastr: ToastrService, public authService: AuthService) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });

    this.subscription = this.documentService.click$.subscribe((res: any) => {
      if (res == 'profile-update') {
        this.editProfilePageEnabled = false;
        this.getProfile();
      } else if (this.isNumericString(res)) {
        console.log(res)
        this.getDocumentData(res);
      } else {
        this.editProfilePageEnabled = false;
      }
    });
  }

  isNumericString(input: any): boolean {
    const numericRegex = /^[0-9]+$/;
    return numericRegex.test(input);
  }

  ngOnInit() {
    this.name = localStorage.getItem('name');
    this.lastName = localStorage.getItem('last-name');
    this.myNotifications();
    this.getDefaultTeams();
    this.getProfile()
  }

  search(e: any) {
    // appending the updated value to the variable
    if (e.target.value.length >= 3) {
      this.documentService.searchAllDocuments(e.target.value).subscribe({
        next: (res) => {
          this.showSearch = true
          this.searchData = res.data.data
        },
        error: (err) => {
        },
      });
    }
  }

  editProfile() {
    this.editProfilePageEnabled = true
  }

  logout() {
    this.router.navigate(['/']);
    localStorage.clear();
  }

  isEditorRoute(): boolean {
    if (this.router.url.startsWith('/dashboard/editor')) {
      let url: any = this.router.url.toString();
      let parts: any = url.split('/');
      // this.docId = parts[parts.length - 1];
    }
    return this.router.url.startsWith('/dashboard/editor');
  }

  editClick() {
    this.documentService.emitClickEvent('editor');
  }

  chatClick() {
    this.documentService.emitClickEvent('chatBox');
  }

  shareClick() {
    this.documentService.emitClickEvent('share');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getOwnerName(data: any) {
    let ownerData = data.find((arr: any) => arr.is_owner === 'Yes');
    return ownerData.users.first_name;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    // Check if the click event originated from within the div
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.showSearch = false; // Close the div
      this.showNotification = false; // Close the div
    }
  }

  myNotifications() {
    this.documentService.getActivity().subscribe((res: any) => {
      this.notifications = res.data.slice(0, 3)
    })
  }

  allTeamActivity(teamId: any) {
    this.documentService.getTeamActivity().subscribe((res: any) => {
      this.teamActivity = res.data.find(({id}: any) => id === teamId)
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

  goBack(): void {
    this.history.pop();
    if (this.history.length > 0) {
      this.location.back();
    } else {
      this.router.navigateByUrl("/dashboard");
    }
  }

  // addTofavorite() {
  //   if (data.favourite_document.length == 0) {
  //     this.documentService.addTofavorite(this.docId).subscribe({
  //       next: (res) => {
  //         this.toastr.success('Successfully added to favorite');
  //       },
  //       error: (err) => {
  //         this.toastr.success(err.message);
  //       },
  //     });
  //   } else {
  //     this.documentService.removeTofavorite(this.docId).subscribe({
  //       next: (res) => {
  //         this.toastr.success('Successfully removed from favorite');
  //       },
  //       error: (err) => {
  //         this.toastr.success(err.message);
  //       },
  //     });
  //   }
  // }

  getProfile() {
    this.authService.getProfile().subscribe({
      next: (res) => {
        this.profileImage = res.data.image;
        this.name = res.data.first_name;
        this.lastName = res.data.last_name;
      },
      error: (err) => {
        // this.toastService.error(err.error.message);
      },
    });
  }

  closeMenu() {
    if (this.showNotification) {
      this.showNotification = false
    }
  }


  addTofavorite() {
    this.documentService.addTofavorite(this.docId).subscribe({
      next: (res) => {
        this.getDocumentData(this.docId);
        this.toastr.success('Successfully added to favorite');
      },
      error: (err) => {
        this.toastr.success(err.message);
      },
    });
  }

  removeFavorite() {
    this.documentService.removeTofavorite(this.docId).subscribe({
      next: (res) => {
        this.getDocumentData(this.docId);
        this.toastr.success('Successfully removed from favorite');
      },
      error: (err) => {
        this.toastr.success(err.message);
      },
    });
  }

  getDocumentData(id: any) {
    console.log(id)
    this.documentService.getDocument(id).subscribe({
      next: (res) => {
       if(res.data) {
          this.documentData = res.data?.favourite_document;
          this.docId = res.data?.id;
          let userId = localStorage.getItem("id")
          let docDetails = this.documentData.find((arr: any) => arr.user_id == userId)
          this.isFavorite = docDetails != undefined
        }
      },
      error: (err) => {
      },
    });
  }

}
