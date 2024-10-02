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
    const url = `${ApiBaseUrl}/Monitoring/getMonitoringList`;
    const errorMessage = 'Failed to fetch Monitoring list!';
    return this.get<MonitoringsResponseModel>(url, errorMessage);
  }


  loadSlaList() {
    const url = `${ApiBaseUrl}/Sla/getSlaList`;
    const errorMessage = 'Failed to fetch sla list!';
    return this.get<SlasResponseModel>(url, errorMessage);
  }


  loadNodeList() {
    const url = `${ApiBaseUrl}/Node/getNodeList`;
    const errorMessage = 'Failed to fetch node list!';
    return this.get<NodesResponseModel>(url, errorMessage);
  }


  loadEmailTemplateList() {
    const url = `${ApiBaseUrl}/EmailTemplate/getEmailTemplateList`;
    const errorMessage = 'Failed to fetch email template list!';
    return this.get<EmailTemplatesResponseModel>(url, errorMessage);
  }

  loadFilteredContactList(player: string) {
    const url = `${ApiBaseUrl}/Contact/getContactList?name=` + encodeURIComponent(player);
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

}
