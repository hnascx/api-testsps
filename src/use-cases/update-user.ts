import { UsersRepository, User } from '@/repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { IncorrectPasswordError } from './errors/incorrect-password-error'
import { NewPasswordsDoNotMatchError } from './errors/new-passwords-do-not-match-error'
import { getFormattedDateFromNow } from '@/utils/get-formatted-date-from-now'
import { validatePassword } from '@/utils/validate-password'
import { PasswordMustBeFourCharactersError } from './errors/password-must-be-four-characters-error'

interface UpdateUserRequest {
  userId: string
  name?: string
  currentPassword?: string
  newPassword?: string
  confirmNewPassword?: string
}

interface UpdateUserResponse {
  user: User
}

export class UpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    name,
    currentPassword,
    newPassword,
    confirmNewPassword,
  }: UpdateUserRequest): Promise<UpdateUserResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    if (newPassword && !validatePassword(newPassword)) {
      throw new PasswordMustBeFourCharactersError()
    }

    if (newPassword && user.password !== currentPassword) {
      throw new IncorrectPasswordError()
    }

    if (
      newPassword &&
      confirmNewPassword &&
      newPassword !== confirmNewPassword
    ) {
      throw new NewPasswordsDoNotMatchError()
    }

    if (name) user.name = name
    if (newPassword) user.password = newPassword

    user.updated_at = getFormattedDateFromNow()

    await this.usersRepository.save(user)

    return { user }
  }
}
