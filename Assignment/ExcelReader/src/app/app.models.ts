export interface UserModel {
  id: number
  uuid: string
  name: string
  email: string
  createdAt: string
}
export interface UploadResponseModel {
  totalRows: number
  skippedRows: number
  failedCount: number
}
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

export interface User {
  id: number
  name: string
  email: string
  createdAt: string
  updatedAt: string
  deletedAt: string
  roleId: number
  verifiedAt: string
  status: string
  role?: Role
}

export interface Role {
  id: number
  roleName: string
}
export interface LoginRequestModel {
  email: string
  password: string
}
export interface SignupRequestModel {
  name: string
  email: string
  password: string
}
export interface DownloadFileRequestModel {
  fileId: number
}

export interface DashboardDataModel {
  fileCount: number
}


export interface FileMetadataResponse {
  id: number
  fileName: string
  fileNameSystem: string
  userId: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  filesizeBytes: number
  user?: User
}

//models for realtime events
export interface FileEvent {
  fileId: number;
  fileMetadata?: FileMetadataResponse
  message: string;
  shouldRefetchList: boolean;
  wasFileDeleted: boolean;
  wasFileModified: boolean;
}
//creating types to make code more readable
export type LoginResponseModel = ResponseModelGeneric<DataUserLoginResponseModel>;
export type SignupResponseModel = ResponseModelGeneric<null>;
export type DownloadFileResponseModel = ResponseModelGeneric<string>;
export type UploadFileResponseModel = ResponseModelGeneric<number>;
export type FileListResponseModel = ResponseModelGeneric<FileMetadataResponse[]>;
export type FileSingleResponseModel = ResponseModelGeneric<FileMetadataResponse>;
export type DashboardResponseModel = ResponseModelGeneric<DashboardDataModel>;

export type CallbackFunction<TArgs extends any[]> = (...args: TArgs) => void;
