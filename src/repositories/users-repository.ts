export interface User {
  id: string
  name: string
  email: string
  type: 'admin' | 'common'
  password: string
  created_at: string
  updated_at: string
}

export interface FindAllUsersRequest {
  search?: string
  limit: number
  offset: number
}

export interface FindAllUsersResponse {
  users: User[]
  total: number
}

export interface UsersRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(params: FindAllUsersRequest): Promise<FindAllUsersResponse>
  create(data: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User>
  save(user: User): Promise<void>
  delete(userId: string): Promise<void>
}
