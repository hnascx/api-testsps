import { User, type UsersRepository } from '@/repositories/users-repository'

interface ListUsersUseCaseRequest {
  search?: string
  page: number
  limit: number
}

interface ListUsersUseCaseResponse {
  users: Omit<User, 'password'>[]
  total: number
}

export class ListUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    search,
    page,
    limit,
  }: ListUsersUseCaseRequest): Promise<ListUsersUseCaseResponse> {
    const pageSize = limit || 20
    const pageNumber = page || 1

    const offset = (pageNumber - 1) * pageSize

    const { users, total } = await this.usersRepository.findAll({
      search,
      limit: pageSize,
      offset,
    })

    const normalizedSearch = search?.trim().toLowerCase() ?? ''

    const filteredUsers = users.filter((user) => {
      const matchesSearch =
        !search ||
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.type.toLowerCase().includes(normalizedSearch)

      return matchesSearch
    })

    const usersWithoutPassword = filteredUsers.map(
      ({ password, ...user }) => user,
    )

    return {
      users: usersWithoutPassword,
      total,
    }
  }
}
