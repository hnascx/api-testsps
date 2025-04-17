import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteUserRequest {
  userId: string
}

export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: DeleteUserRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    await this.usersRepository.delete(userId)
  }
}
