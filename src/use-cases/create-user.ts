import { UsersRepository, type User } from '@/repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { validatePassword } from '@/utils/validate-password'
import { PasswordMustBeFourCharactersError } from './errors/password-must-be-four-characters-error'

interface CreateUserUseCaseRequest {
  name: string
  email: string
  type: 'admin' | 'common'
  password: string
}

interface CreateUserUseCaseResponse {
  user: User
}

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    type,
    password,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    if (!validatePassword(password)) {
      throw new PasswordMustBeFourCharactersError()
    }

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      type,
      password,
    })

    return {
      user,
    }
  }
}
