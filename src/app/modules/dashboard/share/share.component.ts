import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {DocumentService} from '../../../services/document.service';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
})
export class ShareComponent {
  pendingTab: boolean = false;
  roleDropdown: boolean = false;
  userRoleDropdown: boolean = false;
  userIndex: number = -1
  @Input() documentId: any;
  @Input() documentSlug: any;
  docId: any
  roles: any;
  selectedRole: any;
  shareByEmailForm!: FormGroup;
  @Input() usersList: any

  constructor(
    public documentService: DocumentService,
    public clipboardService: ClipboardService,
    public toastService: ToastrService,
    public formBuilder: FormBuilder,
    public route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.usersList = this.usersList.filter((obj: any) => obj.status == "Joined");
    this.docId = this.route.snapshot.params['document_id'];
    this.getRoles();
    this.shareByEmailForm = this.formBuilder.group({
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^[A-Za-z0-9_.+-]+@[A-Za-z0-9-]+\.[A-Za-z0-9-.]+$/
          ),
        ]),
      ],
    });
  }

  closeModal() {
    this.documentService.emitClickEvent('share');
  }

  exportPdf() {
   this.documentService.generatePdf(this.documentId).subscribe({
     next: (res) => {
       const url = res.url;
       const fileName = url.substring(url.lastIndexOf('/') + 1);
       fetch(res.url)
         .then(response => response.blob())
         .then(blob => {
           const url = window.URL.createObjectURL(blob);
           const a = document.createElement('a');
           a.href = url;
           a.download = fileName;
           a.click();
           window.URL.revokeObjectURL(url);
         });
       this.closeModal();
       console.log(res);
     }, error: (err) => {

     }
   })
  }

  exportHTML() {
    this.documentService.generateHTML(this.documentId).subscribe({
      next: (res) => {
        // this.http.get(res.data, { responseType: 'blob' }).subscribe((responseBlob: Blob) => {
        //   const url = URL.createObjectURL(responseBlob);
        //
        //   const link = document.createElement('a');
        //   link.href = url;
        //   link.download = 'file.html'; // Specify the desired filename here
        //   link.click();
        //
        //   URL.revokeObjectURL(url); // Clean up the created URL
        // });
        const url = res.data;
        const fileName = url.substring(url.lastIndexOf('/') + 1);
        const xhr = new XMLHttpRequest();
        xhr.open('GET', res.data, true);
        xhr.responseType = 'blob';

        xhr.onload = function() {
          if (xhr.status === 200) {
            const blob = new Blob([xhr.response], { type: 'text/html' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = fileName; // Specify the desired filename here
            link.click();

            URL.revokeObjectURL(url); // Clean up the created URL
          }
        };

        xhr.send();
      }, error: (err) => {

      }
    })
  }

  changeUserRole(role: any, user: any) {
    const data = {
      document_id: user.document_id,
      user_id: user.users.id,
      role_id: role.id
    }
    this.documentService.changeDocUserRole(data).subscribe({
      next: (res) => {
        user.role_id = role.id
        this.userRoleDropdown = false
      }, error: (err) => {

      }
    })

  }

  getUserRole(id: any) {
    if (this.roles) {
      let ownerData = this.roles.find((role: any) => role.id === id);
      return ownerData?.name;
    }

  }

  getRoles() {
    this.documentService.getRoles().subscribe({
      next: (res: any) => {
        this.roles = res.data;
        this.selectedRole = this.roles[0];
      },
      error: (err) => {
        this.toastService.error(err.error.message);
      },
    });
  }

  selectRole(role: any) {
    this.selectedRole = role;
    this.roleDropdown = false;
  }

  shareByEmail() {
    const data = {
      document_id: this.documentId || this.docId,
      email: this.shareByEmailForm.value.email,
      role_id: this.selectedRole.id
    };
    this.documentService.shareToTeamMate(data).subscribe({
      next: (res: any) => {
        this.documentService.emitClickEvent('share');
      },
      error: (err: any) => {
        console.log(err.error.message);
      },
    });
  }

  closeMenu() {
    this.roleDropdown = false;
  }

  closeUserMenu() {
    this.userRoleDropdown = false;
  }

  copyLink(){
    this.clipboardService.copy(
      `https://kopist.zehntech.net/dashboard/editor/${this.documentSlug}`
    );
    this.toastService.success("You have successfully copied")
  }
}
