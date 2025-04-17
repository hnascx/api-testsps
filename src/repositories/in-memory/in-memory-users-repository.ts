import { randomUUID } from 'node:crypto'
import {
  UsersRepository,
  User,
  FindAllUsersRequest,
  FindAllUsersResponse,
} from '../users-repository'
import { getFormattedDateFromNow } from '@/utils/get-formatted-date-from-now'
import { CannotDeleteInitialAdminUserError } from '@/use-cases/errors/cannot-delete-initial-admin-user-error'

const formattedDate = getFormattedDateFromNow()

const initialAdminUser: User = {
  id: randomUUID(),
  name: 'admin',
  email: 'admin@spsgroup.com.br',
  type: 'admin',
  password: '1234',
  created_at: formattedDate,
  updated_at: formattedDate,
}

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [initialAdminUser]
  private readonly initialAdminId = initialAdminUser.id

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findAll({
    search,
    limit,
    offset,
  }: FindAllUsersRequest): Promise<FindAllUsersResponse> {
    const filteredUsers = this.items.filter((user) => {
      return (
        user.name.toLowerCase().includes(search?.toLowerCase() || '') ||
        user.email.toLowerCase().includes(search?.toLowerCase() || '') ||
        user.type.toLowerCase().includes(search?.toLowerCase() || '')
      )
    })

    const total = filteredUsers.length

    const paginatedUsers = filteredUsers.slice(offset, offset + limit)

    return {
      users: paginatedUsers,
      total,
    }
  }

  async create(data: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      type: data.type,
      password: data.password,
      created_at: formattedDate,
      updated_at: formattedDate,
    }

    this.items.push(user)

    return user
  }

  async save(updatedUser: User) {
    const index = this.items.findIndex((user) => user.id === updatedUser.id)

    if (index >= 0) {
      this.items[index] = updatedUser
    }
  }

  async delete(userId: string) {
    if (userId === this.initialAdminId) {
      throw new CannotDeleteInitialAdminUserError()
    }

    this.items = this.items.filter((user) => user.id !== userId)
  }
}
