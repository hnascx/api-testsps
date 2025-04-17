import { usersRepository } from '@/repositories/in-memory'
import { UpdateUserUseCase } from '../update-user'

export function makeUpdateUserUseCase() {
  const updateUserUseCase = new UpdateUserUseCase(usersRepository)

  return updateUserUseCase
}
