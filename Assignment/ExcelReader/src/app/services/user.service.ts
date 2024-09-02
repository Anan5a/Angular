import { Injectable } from '@angular/core';
import { BaseNetworkService } from './base-network.service'; // Import the base service
import { ApiBaseUrl } from '../../constants';
import { UserModel, UploadResponseModel, FileListResponseModel, ResponseModelGeneric } from '../app.models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseNetworkService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  loadFileList() {
    const url = `${ApiBaseUrl}/File/list`;
    const errorMessage = 'Failed to fetch file list!';
    return this.get<FileListResponseModel>(url, errorMessage);
  }

  uploadFile(formData: FormData) {
    const url = `${ApiBaseUrl}/File/upload`;
    const errorMessage = 'Failed to upload file!';
    return this.post<FormData, UploadResponseModel>(url, formData, errorMessage);
  }

  downloadFile() {
    const url = `${ApiBaseUrl}/File/Export`;
    const errorMessage = 'Failed to export file!';
    return this.post<null, Blob>(url, null, errorMessage, { responseType: 'blob' });
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






}
