import type { User, UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUserUseCaseResponse {
  user: User
}

export class AuthenticateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    if (user.password !== password) {
      throw new InvalidCredentialsError()
    }

    return {
      user,
    }
  }
}
