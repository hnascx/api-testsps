import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepositoryForTests } from '@/repositories/in-memory-for-tests/in-memory-users-repository-for-tests'
import { AuthenticateUserUseCase } from './authenticate-user'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepositoryForTests
let sut: AuthenticateUserUseCase

describe('Authenticate User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepositoryForTests()
    sut = new AuthenticateUserUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@sp.com.br',
      type: 'admin',
      password: '1234',
    })

    const { user } = await sut.execute({
      email: 'johndoe@sp.com.br',
      password: '1234',
    })

    expect(user.name).toEqual(createdUser.name)
    expect(user.password).toEqual(createdUser.password)
  })

  it('should be able to authenticate with wrong email', async () => {
    expect(() =>
      sut.execute({
        email: 'johndoe@sp.com.br',
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@sp.com.br',
      type: 'admin',
      password: '1234',
    })

    expect(() =>
      sut.execute({
        email: 'johndoe@sp.com.br',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
