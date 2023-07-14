import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {WorkflowEditorComponent} from './workflow-editor/workflow-editor.component';
import {DocumentsComponent} from './documents/documents.component';
import {TeammatesComponent} from './teammates/teammates.component';
import {TeammateDetailComponent} from './teammate-detail/teammate-detail.component';
import {NotificationsComponent} from './notifications/notifications.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'editor/:document_id',
    component: WorkflowEditorComponent
  },
  {
    path: 'documents',
    component: DocumentsComponent
  },
  {
    path: 'teammates',
    component: TeammatesComponent
  },
  {
    path: 'teammates/:id/:teamId',
    component: TeammateDetailComponent
  },
  {
    path: 'notifications',
    component: NotificationsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
