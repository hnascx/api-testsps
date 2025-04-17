import { usersRepository } from '@/repositories/in-memory'
import { UpdateUserByAdminUseCase } from '../update-user-by-admin'

export function makeUpdateUserByAdminUseCase() {
  const updateUserByAdminUseCase = new UpdateUserByAdminUseCase(usersRepository)

  return updateUserByAdminUseCase
}
