import { usersRepository } from '@/repositories/in-memory'
import { AuthenticateUserUseCase } from '../authenticate-user'

export function makeAuthenticateUserUseCase() {
  const authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)

  return authenticateUserUseCase
}
