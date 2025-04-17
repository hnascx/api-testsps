import { usersRepository } from '@/repositories/in-memory'
import { DeleteUserUseCase } from '../delete-user'

export function makeDeleteUserUseCase() {
  const deleteUserUseCase = new DeleteUserUseCase(usersRepository)

  return deleteUserUseCase
}
