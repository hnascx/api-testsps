import { usersRepository } from '@/repositories/in-memory'
import { ListUsersUseCase } from '../list-users'

export function makeListUsersUseCase() {
  const listUsersUseCase = new ListUsersUseCase(usersRepository)

  return listUsersUseCase
}
