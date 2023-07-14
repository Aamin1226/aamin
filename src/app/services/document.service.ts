import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {APP_CONFIG} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient) {
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private clickSource = new Subject<any>();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  click$ = this.clickSource.asObservable();

  emitClickEvent(func?: any) {
    this.clickSource.next(func ? func : true);
  }

  emitClickMoveTeam() {
    this.clickSource.next('move');
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private changeTeamSource = new Subject<any>();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  changeTeam$ = this.changeTeamSource.asObservable();

  emitChangeTeamEvent() {
    this.changeTeamSource.next('team-change');
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private changeDocumentStepSource = new Subject<boolean>();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  changeDocumentStep$ = this.changeDocumentStepSource.asObservable();

  emitChangeDocumentStepEvent(step: any) {
    this.changeDocumentStepSource.next(step);
  }

  getAllDocuments(status: any, page: any): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/document?status=${status}&perpage=${page}`);
  }

  searchAllDocuments(name: any): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/document?name=${name}`);
  }

  searchDocuments(name: any): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/document?name=${name}`);
  }

  getDocument(id: any): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/document/${id}`);
  }

  getDocumentBySlug(slug: string): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/document/info/${slug}`);
  }

  deleteDocument(id: any): Observable<any> {
    return this.http.delete(`${APP_CONFIG.apiUrl}/document/disable/${id}`);
  }

  createStep(data: any): Observable<any> {
    return this.http.post(`${APP_CONFIG.apiUrl}/document/step/create`, data);
  }

  updateStep(data: any, id: any): Observable<any> {
    return this.http.post(`${APP_CONFIG.apiUrl}/document/step/update/${id}`, data);
  }

  updateDocument(data: any, id: any): Observable<any> {
    return this.http.post(`${APP_CONFIG.apiUrl}/document/update/${id}`, data);
  }

  deleteStep(id: any): Observable<any> {
    return this.http.delete(`${APP_CONFIG.apiUrl}/document/step/disable/${id}`);
  }

  getTeams(): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/team`);
  }

  getDefaultTeams(): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/user/default/team`);
  }

  setDefaultTeams(id: any): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/user/set/default/team/${id}`);
  }

  duplicateDocument(id: any): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/document/duplicate/${id}`);
  }

  moveToTeam(data: any) {
    return this.http.post(`${APP_CONFIG.apiUrl}/document/team/share`, data);
  }

  updateTeam(data: any, id: any) {
    return this.http.post(`${APP_CONFIG.apiUrl}/team/update/${id}`, data);
  }

  getImage(data: any) {
    return this.http.post(`${APP_CONFIG.apiUrl}/image`, data);
  }

  sendInvitationToTeam(data: any) {
    return this.http.post(`${APP_CONFIG.apiUrl}/team/invite`, data);
  }

  removeInvitationToTeam(data: any) {
    return this.http.post(`${APP_CONFIG.apiUrl}/team/revoke/invitation`, data);
  }

  reactionOnDocument(data: any) {
    return this.http.post(`${APP_CONFIG.apiUrl}/document/react`, data);
  }

  resendInvitationToTeam(data: any) {
    return this.http.post(`${APP_CONFIG.apiUrl}/team/invite`, data);
  }

  resendAllInvitationToTeam(id: any) {
    return this.http.get(`${APP_CONFIG.apiUrl}/team/reinvite/all/member/${id}`);
  }

  addTofavorite(id: any) {
    return this.http.get(`${APP_CONFIG.apiUrl}/document/favourite/add/${id}`);
  }

  removeTofavorite(id: any) {
    return this.http.delete(`${APP_CONFIG.apiUrl}/document/favourite/remove/${id}`);
  }

  getTeamDetails(id: any) {
    return this.http.get(`${APP_CONFIG.apiUrl}/team/${id}`);
  }

  getSharedWithDocument(id: any) {
    return this.http.get(`${APP_CONFIG.apiUrl}/team/documentbyteam/${id}`);
  }

  getRoles() {
    return this.http.get(`${APP_CONFIG.apiUrl}/roles`);
  }

  getReactionEmoji() {
    return this.http.get(`${APP_CONFIG.apiUrl}/emojis`);
  }

  getTeamDetailsById(id: any) {
    return this.http.get(`${APP_CONFIG.apiUrl}/team/members/${id}`);
  }

  getMyFavoriteDocs(): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/document/favourite/my`);
  }

  getMySharedDocs(): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/document/shared`);
  }

  shareToTeamMate(data: any) {
    return this.http.post(`${APP_CONFIG.apiUrl}/document/share`, data);
  }

  getMyPrivateDocs(): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/document/private`);
  }

  getMystats(): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/user/mystats`);
  }

  getTeamstats(id: any): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/team/stats/${id}`);
  }

  getTeamsetting(id: any): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/team/settings/${id}`);
  }

  getActivity(): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/user/activities`);
  }

  getTeamActivity(): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/team/activities`);
  }
  generatePdf(docId: any): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/document/pdf/${docId}`);
  }

 generateHTML(docId:any): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/document/html/${docId}`);
  }

  deleteMember(userId: any, teamId: any): Observable<any> {
    return this.http.delete(`${APP_CONFIG.apiUrl}/team/removeuser/${userId}/${teamId}`);
  }

  postComment(data: any) {
    return this.http.post(`${APP_CONFIG.apiUrl}/document/comment/create`, data);
  }

  changeTeamSetting(data: any) {
    return this.http.post(`${APP_CONFIG.apiUrl}/team/settings/change`, data);
  }

  changeDocUserRole(data: any) {
    return this.http.post(`${APP_CONFIG.apiUrl}/document/change/role`, data);
  }

  updateComment(id: any, data: any) {
    return this.http.post(`${APP_CONFIG.apiUrl}/document/comment/update/${id}`, data);
  }

  changeTeamUserRole(data: any) {
    return this.http.post(`${APP_CONFIG.apiUrl}/team/change/role`, data);
  }

  changeOrderOfSteps(data: any) {
    return this.http.post(`${APP_CONFIG.apiUrl}/document/step/change/order`, data);
  }

  revokeToken(token: string) {
    const headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = `token=${token}`;

    return this.http.post('https://oauth2.googleapis.com/revoke', body, {headers});
  }
}
