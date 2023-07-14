import {Component} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {PasswordStrengthValidator} from '../../../modules/auth/password-strength.validators';
import Validation from '../../../modules/auth/validation';
import {AuthService} from '../../../services/auth.service';
import {DocumentService} from '../../../services/document.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent {
  editProfileForm!: FormGroup;
  resetPasswordForm!: FormGroup;
  profileOptions: boolean = false;
  editImage: boolean = false;
  profileImage: any;
  updatedImage: any;

  constructor(
    public formBuilder: FormBuilder,
    public documentService: DocumentService,
    public toastService: ToastrService,
    public authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.editProfileForm = this.formBuilder.group({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
    });

    this.resetPasswordForm = this.formBuilder.group(
      {
        old_password: new FormControl('', [Validators.required]),
        new_password: [null, Validators.compose([
          Validators.required, Validators.minLength(8), PasswordStrengthValidator])],
        confirm_password: new FormControl('', [Validators.required]),
      },
      {
        validators: [Validation.match('new_password', 'confirm_password')],
      }
    );
    this.getProfile()
  }

  closeModal() {
    this.documentService.emitClickEvent();
  }

  saveChanges() {
    let form = new FormData();
    form.append('first_name', this.editProfileForm.value.first_name)
    form.append('last_name', this.editProfileForm.value.last_name)
    if (this.updatedImage) {
      form.append('image', this.updatedImage);
    }
    this.authService.updateProfile(form).subscribe({
      next: (res) => {
        this.toastService.success('Profile Updated Successfully');
        this.documentService.emitClickEvent('profile-update');
      },
      error: (err) => {
        this.toastService.error(err.error.message);
      },
    });
  }

  getProfile() {
    this.authService.getProfile().subscribe({
      next: (res) => {
        this.profileImage = res.data.image;
        this.editProfileForm.patchValue({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
        });
        localStorage.setItem('last-name', res.data.last_name)
        localStorage.setItem('name', res.data.first_name)
      },
      error: (err) => {
        this.toastService.error(err.error.message);
      },
    });
  }

  url: any = '';

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.updatedImage = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.profileImage = event?.target.result;
      }
    }
  }

  changePassword() {
    if (!this.resetPasswordForm.valid) {
      return;
    } else {
      this.authService
        .changePassword(this.resetPasswordForm.value)
        .subscribe({
          next: (res) => {
            this.documentService.emitClickEvent('profile-update');
            this.toastService.success("Password changed successfully");
          },
          error: (err) => {

            this.toastService.error(err.error.message);
          },
        });
    }
  }
}
