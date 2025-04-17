import { usersRepository } from '@/repositories/in-memory'
import { CreateUserUseCase } from '../create-user'

export function makeCreateUserUseCase() {
  const createUserUseCase = new CreateUserUseCase(usersRepository)

  return createUserUseCase
}
