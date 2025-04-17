import { User, UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { IncorrectPasswordError } from './errors/incorrect-password-error'
import { NewPasswordsDoNotMatchError } from './errors/new-passwords-do-not-match-error'
import { getFormattedDateFromNow } from '@/utils/get-formatted-date-from-now'
import { validatePassword } from '@/utils/validate-password'
import { PasswordMustBeFourCharactersError } from './errors/password-must-be-four-characters-error'

interface UpdateUserByAdminRequest {
  userId: string
  currentPassword?: string
  newPassword?: string
  confirmNewPassword?: string
  name?: string
  type?: 'admin' | 'common'
}

interface UpdateUserByAdminResponse {
  user: User
}

export class UpdateUserByAdminUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    currentPassword,
    newPassword,
    confirmNewPassword,
    name,
    type,
  }: UpdateUserByAdminRequest): Promise<UpdateUserByAdminResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    if (newPassword && !validatePassword(newPassword)) {
      throw new PasswordMustBeFourCharactersError()
    }

    if (currentPassword && user.password !== currentPassword) {
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
    if (type) user.type = type
    if (newPassword) user.password = newPassword

    user.updated_at = getFormattedDateFromNow()

    await this.usersRepository.save(user)

    return { user }
  }
}
