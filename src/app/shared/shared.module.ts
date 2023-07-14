import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAgoPipe} from './pipes/date-ago.pipe';
import {InviteMemberComponent} from '../modules/dashboard/invite-member/invite-member.component';
import {ClickOutsideDirective} from './directives/click-outside.directive';

@NgModule({
  declarations: [DateAgoPipe, InviteMemberComponent, ClickOutsideDirective],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [DateAgoPipe, InviteMemberComponent, ClickOutsideDirective],
})
export class SharedModule {
}
