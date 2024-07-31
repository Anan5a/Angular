export interface CreateUserRequestModel {
  name: string
  email: string
  password: string
}
export interface UserResponseModel {
  id: number
  name: string
  email: string
  createdAt: string
  modifiedAt: string
  roleId: number
  role?: RoleResponseModel
}

export interface RoleResponseModel {
  id: number
  roleName: string
}
export interface UserUpdateRequestModel {
  name: string
  email: string
  newPassword: string
  password: string
  roleId: number
}
export interface UserLoginResponseModel {
  token: string
  user: UserResponseModel
}
export interface UserLoginRequestModel {
  email: string
  password: string
}
