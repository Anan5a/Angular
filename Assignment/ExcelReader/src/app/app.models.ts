export interface UploadResponseModel {
  totalRows: number;
  skippedRows: number;
  failedCount: number;
}
/////////////////////////////////////////////////
export interface ResponseModelGeneric<T> {
  status: string;
  error?: string;
  message: string;
  data?: T;
}

export interface RTCConnModel {
  targetUserId: number;
  data?: string;
  targetUserName?: string;
}

export interface DataUserLoginResponseModel {
  token: string;
  user: User;
}

export interface User {
  userId: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  roleId: number;
  verifiedAt: string;
  status: string;
  role?: Role;
}
export interface ChatUserLimited {
  id: number;
  name: string;
  agentInfo?: ChatUserLimited;
}
export interface ChatMessageHistoryModel {
  chatHistoryId: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
}

export interface Role {
  roleId: number;
  roleName: string;
}
export interface LoginRequestModel {
  email: string;
  password: string;
}
export interface SignupRequestModel {
  name: string;
  email: string;
  password: string;
}
export interface DownloadFileRequestModel {
  fileId: number;
}

export interface DashboardDataModel {
  fileCount: number;
}

export interface FileMetadataResponse {
  fileMetadataId: number;
  fileName: string;
  fileNameSystem: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  filesizeBytes: number;
  user?: User;
}
export interface GroupModel {
  groupId: number;
  groupName: string;
  createdAt: string;
  deletedAt: string;
  updatedAt: string;
  members?: GroupMemberModel[];
}
export interface GroupMemberModel {
  groupMembershipId: number;
  groupId: number;
  userId: number;
  createdAt: string;
  deletedAt: string;
  userDetails?: User;
}
//models for realtime events
export interface FileEvent {
  fileId: number;
  fileMetadata?: FileMetadataResponse;
  message: string;
  shouldRefetchList: boolean;
  wasFileDeleted: boolean;
  wasFileModified: boolean;
}
export interface ChatEvent {
  message: string;
  from: number;
  content: string;
  isSystemMessage?: boolean;
  sentAt: string;
  messageId?: number;
  endOfChatMarker?: true;
}
// export interface AgentChannelMessage<MetaT = any> {
//   message: string;
//   callData?: string | null;
//   metadata?: MetaT | null;
//   isSystemMessage?: boolean | null;
// }
export interface AgentChannelMessage<MetaT> {
  message: string;
  callData?: string | null;
  metadata?: MetaT | null;
  isSystemMessage?: boolean | null;
  containsUser?: boolean | null;
  containsCallData?: boolean | null;
  acceptIntoChat?: boolean | null;
  removeUserFromList?: boolean | null;
}

////////////
export interface SendMessageModel {
  to: number;
  message: string;
}
export interface ChatRepositoryModel {
  recpId: number;

  chatList: ChatMessageModel[];
}
export interface ChatMessageModel {
  from: number;
  to: number;
  text: string;
  sentAt: string | null;
  didView?: boolean;
  isSystemMessage?: boolean;
  messageId?: number;
}

//creating types to make code more readable
export type LoginResponseModel =
  ResponseModelGeneric<DataUserLoginResponseModel>;
export type SignupResponseModel = ResponseModelGeneric<null>;
export type DownloadFileResponseModel = ResponseModelGeneric<string>;
export type UploadFileResponseModel = ResponseModelGeneric<number>;
export type FileListResponseModel = ResponseModelGeneric<
  FileMetadataResponse[]
>;
export type UserListResponseModel = ResponseModelGeneric<User[]>;
export type UserInfoResponseModel = ResponseModelGeneric<User>;
export type RTCRequestResponseModel = ResponseModelGeneric<boolean>;
export type FileSingleResponseModel =
  ResponseModelGeneric<FileMetadataResponse>;
export type DashboardResponseModel = ResponseModelGeneric<DashboardDataModel>;
export type OnlineUserListResponseModel = ResponseModelGeneric<
  ChatUserLimited[]
>;
export type SendMessageToUserResponseModel = ResponseModelGeneric<
  string | null | number
  >;
export type GroupListResponseModel = ResponseModelGeneric<GroupModel[]>;
export type GroupMembersListResponseModel = ResponseModelGeneric<GroupMemberModel[]>;

export type CallbackFunction<TArgs extends unknown[]> = (
  ...args: TArgs
) => void;
