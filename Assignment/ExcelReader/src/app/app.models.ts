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
