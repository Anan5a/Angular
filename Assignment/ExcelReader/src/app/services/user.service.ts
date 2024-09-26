import { Injectable } from '@angular/core';
import { BaseNetworkService } from './base-network.service'; // Import the base service
import { ApiBaseUrl } from '../../constants';
import { UploadResponseModel, FileListResponseModel, ResponseModelGeneric, Role, DashboardDataModel, FileSingleResponseModel, DashboardResponseModel, OnlineUserListResponseModel, SendMessageModel, SendMessageToUserResponseModel, UserListResponseModel } from '../app.models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseNetworkService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  loadFileList(systemFileList: boolean | null | undefined) {
    const query = systemFileList ? '?systemFiles=true' : '';
    const url = `${ApiBaseUrl}/File/list${query}`;
    const errorMessage = 'Failed to fetch file list!';
    return this.get<FileListResponseModel>(url, errorMessage);
  }

  loadUsersList() {
    const url = `${ApiBaseUrl}/User/list`;
    const errorMessage = 'Failed to fetch user list!';
    return this.get<UserListResponseModel>(url, errorMessage);
  }

  getFileById(fileId: number) {
    const url = `${ApiBaseUrl}/File/file/` + fileId;
    const errorMessage = 'Failed to fetch file details!';
    return this.get<FileSingleResponseModel>(url, errorMessage);
  }

  uploadFile(formData: FormData) {
    const url = `${ApiBaseUrl}/File/upload`;
    const errorMessage = 'Failed to upload file!';
    return this.post<FormData, UploadResponseModel>(url, formData, errorMessage);
  }

  dashboardData() {
    const url = `${ApiBaseUrl}/User/dashboard`;
    const errorMessage = 'Failed to fetch dashboard!';
    return this.get<DashboardResponseModel>(url, errorMessage);
  }
  updateFile(formData: {}) {
    const url = `${ApiBaseUrl}/File/update`;
    const errorMessage = 'Failed to update file!';
    return this.post<{}, ResponseModelGeneric<string>>(url, formData, errorMessage);
  }

  downloadFile(fileId: number) {
    const url = `${ApiBaseUrl}/File/download-link`;
    const errorMessage = 'Failed to create download link!';
    return this.post<{}, ResponseModelGeneric<string>>(url, { fileId }, errorMessage);
  }

  deleteFile(fileId: number) {
    const url = `${ApiBaseUrl}/File/delete/${fileId}`;
    const errorMessage = 'Failed to delete file!';
    return this.delete<ResponseModelGeneric<string>>(url, errorMessage);
  }


  exportAll() {
    const url = `${ApiBaseUrl}/File/Export`;
    const errorMessage = 'Failed to export file!';
    return this.post<null, Blob>(url, null, errorMessage, { responseType: 'blob' });
  }

  changePassword(formData: { oldPassword: string, newPassword: string }) {
    const url = `${ApiBaseUrl}/User/change-password`;
    const errorMessage = 'Failed to change password!';
    return this.post<{}, ResponseModelGeneric<null>>(url, formData, errorMessage);
  }
  /////////messaging features
  getOnlineUsers() {
    const url = `${ApiBaseUrl}/User/online-users`;
    const errorMessage = 'Failed to fetch online users!';
    return this.get<OnlineUserListResponseModel>(url, errorMessage);
  }
  sendMessageToUser(model: SendMessageModel) {
    const url = `${ApiBaseUrl}/User/send-message`;
    const errorMessage = 'Failed to send message!';
    return this.post<SendMessageModel, SendMessageToUserResponseModel>(url, model, errorMessage);
  }



  ////////admin functions

  getNewUserConfig() {
    const url = `${ApiBaseUrl}/Admin/new-user-config`;
    const errorMessage = 'Failed to get config!';
    return this.get<ResponseModelGeneric<{ roles: Role[] }>>(url, errorMessage);
  }

  createNewUser(formData: {}) {
    const url = `${ApiBaseUrl}/Admin/create-user`;
    const errorMessage = 'Failed to create new user!';
    return this.post<{}, ResponseModelGeneric<null>>(url, formData, errorMessage);
  }


}
