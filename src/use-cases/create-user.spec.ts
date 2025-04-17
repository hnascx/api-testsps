import { beforeEach, describe, expect, it } from 'vitest'
import { CreateUserUseCase } from './create-user'
import { InMemoryUsersRepositoryForTests } from '@/repositories/in-memory-for-tests/in-memory-users-repository-for-tests'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { PasswordMustBeFourCharactersError } from './errors/password-must-be-four-characters-error'

let usersRepository: InMemoryUsersRepositoryForTests
let sut: CreateUserUseCase

describe('Create User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepositoryForTests()
    sut = new CreateUserUseCase(usersRepository)
  })

  it('should be able to create a new user', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@sp.com.br',
      type: 'admin',
      password: '1234',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not allow creating a user with same email', async () => {
    const email = 'johndoe@sp.com.br'

    await sut.execute({
      name: 'John Doe',
      email,
      type: 'admin',
      password: '1234',
    })

    expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        type: 'admin',
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should not allow creating a user with a password shorter than 4 characters', async () => {
    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email: 'johndoe@sp.com.br',
        type: 'admin',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(PasswordMustBeFourCharactersError)
  })
})
