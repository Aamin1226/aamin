import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {AdminComponent} from './admin.component';
import {AdminRoutingModule} from './admin-routing.module';
import {SidebarComponent} from './sidebar/sidebar.component';
import {NavbarComponent} from './navbar/navbar.component';
import {PersonaliseComponent} from './personalise/personalise.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CreateTeamComponent} from '../../modules/dashboard/create-team/create-team.component';
import {EditProfileComponent} from './edit-profile/edit-profile.component';
import {WorkspaceSettingsComponent} from './workspace-settings/workspace-settings.component';
import {PerfectScrollbarModule} from '../../modules/perfect-scrollbar/perfect-scrollbar.module';

@NgModule({
  declarations: [
    AdminComponent,
    SidebarComponent,
    NavbarComponent,
    PersonaliseComponent,
    CreateTeamComponent,
    EditProfileComponent,
    WorkspaceSettingsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule
  ],
  providers: [],
})
export class AdminModule {
}
