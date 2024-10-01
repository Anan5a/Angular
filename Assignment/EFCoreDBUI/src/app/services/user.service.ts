import { Injectable } from '@angular/core';
import { BaseNetworkService } from './base-network.service'; // Import the base service
import { ApiBaseUrl } from '../../constants';
import { ContactssResponseModel, EmailTemplatesResponseModel, MonitoringsResponseModel, NodeResponseModel, NodesResponseModel, ResponseModelGeneric, SlaModel, SlaResponseModel, SlasResponseModel } from '../app.models';
import { HttpClient } from '@angular/common/http';
import { EmailTemplatesComponent } from '../dashboard/email-templates/email-templates.component';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseNetworkService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }


  loadMonitoringList() {
    const url = `${ApiBaseUrl}/Monitoring/index`;
    const errorMessage = 'Failed to fetch Monitoring list!';
    return this.get<MonitoringsResponseModel>(url, errorMessage);
  }


  loadSlaList() {
    const url = `${ApiBaseUrl}/Sla/index`;
    const errorMessage = 'Failed to fetch sla list!';
    return this.get<SlasResponseModel>(url, errorMessage);
  }


  loadNodeList() {
    const url = `${ApiBaseUrl}/Node/index`;
    const errorMessage = 'Failed to fetch node list!';
    return this.get<NodesResponseModel>(url, errorMessage);
  }


  loadEmailTemplateList() {
    const url = `${ApiBaseUrl}/EmailTemplate/index`;
    const errorMessage = 'Failed to fetch email template list!';
    return this.get<EmailTemplatesResponseModel>(url, errorMessage);
  }

  loadFilteredContactList(player: string) {
    const url = `${ApiBaseUrl}/Contact/index?name=` + encodeURIComponent(player);
    const errorMessage = 'Failed to fetch filtered list!';
    return this.get<ContactssResponseModel>(url, errorMessage);
  }

  deleteSla(id: number) {
    const url = `${ApiBaseUrl}/Sla/${id}`;
    const errorMessage = 'Failed to delete sla!';
    return this.delete<ResponseModelGeneric<string>>(url, errorMessage);
  }


  deleteEmailTemplate(id: number) {
    const url = `${ApiBaseUrl}/EmailTemplate/${id}`;
    const errorMessage = 'Failed to delete template!';
    return this.delete<ResponseModelGeneric<string>>(url, errorMessage);
  }

  createUpdateSla(formData: {}) {
    const url = `${ApiBaseUrl}/Sla`;
    const errorMessage = 'Failed to create or update sla!';
    return this.post<{}, SlaResponseModel>(url, formData, errorMessage);
  }

  createUpdateEmailTemplate(formData: {}) {
    const url = `${ApiBaseUrl}/EmailTemplate`;
    const errorMessage = 'Failed to create or update sla!';
    return this.post<{}, SlaResponseModel>(url, formData, errorMessage);
  }


  createUpdateNode(formData: {}) {
    const url = `${ApiBaseUrl}/Node`;
    const errorMessage = 'Failed to create or update node!';
    return this.post<{}, NodeResponseModel>(url, formData, errorMessage);
  }
  // dashboardData() {
  //   const url = `${ApiBaseUrl}/User/dashboard`;
  //   const errorMessage = 'Failed to fetch dashboard!';
  //   return this.get<DashboardResponseModel>(url, errorMessage);
  // }
  // updateFile(formData: {}) {
  //   const url = `${ApiBaseUrl}/File/update`;
  //   const errorMessage = 'Failed to update file!';
  //   return this.post<{}, ResponseModelGeneric<string>>(url, formData, errorMessage);
  // }

  // downloadFile(fileId: number) {
  //   const url = `${ApiBaseUrl}/File/download-link`;
  //   const errorMessage = 'Failed to create download link!';
  //   return this.post<{}, ResponseModelGeneric<string>>(url, { fileId }, errorMessage);
  // }

  // deleteFile(fileId: number) {
  //   const url = `${ApiBaseUrl}/File/delete/${fileId}`;
  //   const errorMessage = 'Failed to delete file!';
  //   return this.delete<ResponseModelGeneric<string>>(url, errorMessage);
  // }


  // exportAll() {
  //   const url = `${ApiBaseUrl}/File/Export`;
  //   const errorMessage = 'Failed to export file!';
  //   return this.post<null, Blob>(url, null, errorMessage, { responseType: 'blob' });
  // }

  // changePassword(formData: { oldPassword: string, newPassword: string }) {
  //   const url = `${ApiBaseUrl}/User/change-password`;
  //   const errorMessage = 'Failed to change password!';
  //   return this.post<{}, ResponseModelGeneric<null>>(url, formData, errorMessage);
  // }
  // /////////messaging features
  // getOnlineUsers() {
  //   const url = `${ApiBaseUrl}/User/online-users`;
  //   const errorMessage = 'Failed to fetch online users!';
  //   return this.get<OnlineUserListResponseModel>(url, errorMessage);
  // }
  // sendMessageToUser(model: SendMessageModel) {
  //   const url = `${ApiBaseUrl}/User/send-message`;
  //   const errorMessage = 'Failed to send message!';
  //   return this.post<SendMessageModel, SendMessageToUserResponseModel>(url, model, errorMessage);
  // }



  // ////////admin functions

  // getNewUserConfig() {
  //   const url = `${ApiBaseUrl}/Admin/new-user-config`;
  //   const errorMessage = 'Failed to get config!';
  //   return this.get<ResponseModelGeneric<{ roles: Role[] }>>(url, errorMessage);
  // }

  // createNewUser(formData: {}) {
  //   const url = `${ApiBaseUrl}/Admin/create-user`;
  //   const errorMessage = 'Failed to create new user!';
  //   return this.post<{}, ResponseModelGeneric<null>>(url, formData, errorMessage);
  // }


}
