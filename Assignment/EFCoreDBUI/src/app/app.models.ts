
/////////////////////////////////////////////////
export interface ResponseModelGeneric<T> {
  status: string
  error?: string
  message: string
  data?: T
}

export interface DataUserLoginResponseModel {
  token: string
  user: User
}

export interface MonitoringModel {
  monitoringId: number
  alias: string
  aggregate: string
  node: string
  player: string
  nodeType: string
  taskType: string
  sla: string
  shifting: string
  processDuration: number
  contact: string
  contactCC: string
  lastControlPosition: string
  nextReconciliationDate: string
  delay: number
  lastModified: string
}
export interface EmailTemplateModel {
  emailTemplateId: number
  emailTemplateName: string
  emailTemplateSubject: string
  emailTemplateBody: string
  lastModified: string
}
export interface NodeModel {
  nodeId: number
  nodeName: string
  alias: string
  aggregate: string
  player: string
  nodeType: string
  nodeSubType: string
  lifeInsuranceClass: string
  slaId: number
  periodicFormat: string
  periodicFormatStartDate: string
  transactionFormat: string
  transactionFormatStartDate: string
  taskType: string
  emailTemplateId: number
  shifting: string
  processDuration: number
  contactId: number
  contactCCId: number
  lastModified: string
}

export interface SlaModel {
  slaId?: number
  slaName: string
  slaFrequencyTransaction: string
  slaFrequencyPosition: string
  slaAnniversary: string
  slaExcludeWeekends: boolean
  slaReminderDays: number
  slaEscalationDays: number
  lastModified: string
}

export interface ContactModel {
  contactId: number
  firstName: string
  lastName: string
  fullName: string
  email: string
  address: string
  player: string
  city: string
  businessPhone: string
  mobilePhone: string
  lastModified: string
}

export interface User {
  userId: number
  firstName: string
  lastName: string
  userName: string
}

export interface LoginRequestModel {
  userName: string
  password: string
}



//creating types to make code more readable
export type LoginResponseModel = ResponseModelGeneric<DataUserLoginResponseModel>;
export type MonitoringsResponseModel = ResponseModelGeneric<MonitoringModel[]>;
export type SlasResponseModel = ResponseModelGeneric<SlaModel[]>;
export type NodesResponseModel = ResponseModelGeneric<NodeModel[]>;
export type NodeResponseModel = ResponseModelGeneric<NodeModel>;
export type SlaResponseModel = ResponseModelGeneric<SlaModel>;
export type EmailTemplatesResponseModel = ResponseModelGeneric<EmailTemplateModel[]>;
export type ContactssResponseModel = ResponseModelGeneric<ContactModel[]>;
export type SignupResponseModel = ResponseModelGeneric<null>;
export type DownloadFileResponseModel = ResponseModelGeneric<string>;
export type UploadFileResponseModel = ResponseModelGeneric<number>;
export type CallbackFunction<TArgs extends any[]> = (...args: TArgs) => void;
