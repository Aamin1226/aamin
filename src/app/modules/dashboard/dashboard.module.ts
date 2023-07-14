import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { WorkflowEditorComponent } from './workflow-editor/workflow-editor.component';
import { SharedModule } from "../../shared/shared.module";
import { ClipboardModule } from 'ngx-clipboard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentsComponent } from './documents/documents.component';
import { TeammatesComponent } from './teammates/teammates.component';
import { TeammateDetailComponent } from './teammate-detail/teammate-detail.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { MoveDocumentComponent } from './move-document/move-document.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ShareComponent } from './share/share.component';
import { PerfectScrollbarModule } from '../../modules/perfect-scrollbar/perfect-scrollbar.module';
import { StartNewComponent } from './start-new/start-new.component';
import { ChangeRoleComponent } from './change-role/change-role.component';
import { CommentComponent } from './comment/comment.component';


@NgModule({
    declarations: [
        DashboardComponent,
        WorkflowEditorComponent,
        DocumentsComponent,
        TeammatesComponent,
        TeammateDetailComponent,
        MoveDocumentComponent,
        NotificationsComponent,
        ShareComponent,
        StartNewComponent,
        ChangeRoleComponent,
        CommentComponent,
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        SharedModule,
        ClipboardModule,
        FormsModule,
        ReactiveFormsModule,
        PerfectScrollbarModule
    ]
})
export class DashboardModule { }
