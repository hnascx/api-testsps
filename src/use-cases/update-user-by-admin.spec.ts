import { UpdateUserByAdminUseCase } from './update-user-by-admin'
import { IncorrectPasswordError } from './errors/incorrect-password-error'
import { NewPasswordsDoNotMatchError } from './errors/new-passwords-do-not-match-error'
import { InMemoryUsersRepositoryForTests } from '@/repositories/in-memory-for-tests/in-memory-users-repository-for-tests'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { PasswordMustBeFourCharactersError } from './errors/password-must-be-four-characters-error'

let usersRepository: InMemoryUsersRepositoryForTests
let sut: UpdateUserByAdminUseCase

describe('Update User By Admin Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepositoryForTests()
    sut = new UpdateUserByAdminUseCase(usersRepository)
  })

  it('should allow updating the user name and email', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '1234',
      type: 'common',
    })

    const updatedUser = await sut.execute({
      userId: user.id,
      name: 'John Doe updated',
      type: 'admin',
    })

    expect(updatedUser.user.name).toBe('John Doe updated')
    expect(updatedUser.user.type).toBe('admin')
  })

  it('should allow changing the password when the current password is correct', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '1234',
      type: 'common',
    })

    const userWithNewPassword = await sut.execute({
      userId: user.id,
      currentPassword: '1234',
      newPassword: '4321',
      confirmNewPassword: '4321',
    })

    expect(userWithNewPassword.user.password).toBe('4321')
  })

  it('should throw an error if the current password is incorrect', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '1234',
      type: 'common',
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        currentPassword: '4321',
        newPassword: '5678',
        confirmNewPassword: '5678',
      }),
    ).rejects.toBeInstanceOf(IncorrectPasswordError)
  })

  it('should throw an error if the new password and confirmation do not match', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '1234',
      type: 'common',
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        currentPassword: '1234',
        newPassword: '4321',
        confirmNewPassword: '5678',
      }),
    ).rejects.toBeInstanceOf(NewPasswordsDoNotMatchError)
  })

  it('should throw an error if the new password is too short', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '1234',
      type: 'common',
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        currentPassword: '1234',
        newPassword: '432',
        confirmNewPassword: '432',
      }),
    ).rejects.toBeInstanceOf(PasswordMustBeFourCharactersError)
  })

  it('should throw an error if the user does not exist', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existent-user-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
