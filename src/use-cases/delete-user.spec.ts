import { describe, it, expect, beforeEach } from 'vitest'
import { DeleteUserUseCase } from './delete-user'
import { InMemoryUsersRepositoryForTests } from '@/repositories/in-memory-for-tests/in-memory-users-repository-for-tests'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { CannotDeleteInitialAdminUserError } from './errors/cannot-delete-initial-admin-user-error'

let usersRepository: InMemoryUsersRepositoryForTests
let sut: DeleteUserUseCase

describe('Delete User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepositoryForTests()
    sut = new DeleteUserUseCase(usersRepository)
  })

  it('should delete a user by id', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234',
      type: 'common',
    })

    await sut.execute({ userId: user.id })

    const foundUser = await usersRepository.findById(user.id)

    expect(foundUser).toBeNull()
  })

  it('should throw ResourceNotFoundError if user does not exist', async () => {
    await expect(() =>
      sut.execute({ userId: 'non-existent-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not allow deleting the initial admin user', async () => {
    const adminUser = usersRepository.items.find(
      (user) => user.email === 'admin@spsgroup.com.br',
    )

    await expect(() =>
      sut.execute({ userId: adminUser!.id }),
    ).rejects.toBeInstanceOf(CannotDeleteInitialAdminUserError)
  })
})
