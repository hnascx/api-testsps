import { describe, it, expect, beforeEach } from 'vitest'
import { ListUsersUseCase } from './list-users'
import { InMemoryUsersRepositoryForTests } from '@/repositories/in-memory-for-tests/in-memory-users-repository-for-tests'

let usersRepository: InMemoryUsersRepositoryForTests
let sut: ListUsersUseCase

describe('List Users Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepositoryForTests()
    sut = new ListUsersUseCase(usersRepository)
  })

  it('should return all users without passwords', async () => {
    const { users, total } = await sut.execute({ page: 1, limit: 20 })

    expect(users).toBeInstanceOf(Array)
    expect(users.length).toBeGreaterThan(0) // default admin user (mocked) is included
    expect(typeof total).toBe('number')

    users.forEach((user) => {
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('name')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('type')
      expect(user).not.toHaveProperty('password')
    })
  })

  it('should return all users if no search is provided', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234',
      type: 'admin',
    })

    const { users, total } = await sut.execute({ page: 1, limit: 20 })

    expect(users).toHaveLength(2) // default admin user (mocked) is included
    expect(total).toBe(2)
  })

  it('should filter users by name using search', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234',
      type: 'admin',
    })

    const { users, total } = await sut.execute({
      search: 'john',
      page: 1,
      limit: 20,
    })

    expect(users).toHaveLength(1)
    expect(users[0].name).toBe('John Doe')
    expect(total).toBe(1)
  })

  it('should filter users by email using search', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234',
      type: 'admin',
    })

    const { users, total } = await sut.execute({
      search: 'johndoe@',
      page: 1,
      limit: 20,
    })

    expect(users).toHaveLength(1)
    expect(users[0].email).toBe('johndoe@example.com')
    expect(total).toBe(1)
  })

  it('should filter users by type using search', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234',
      type: 'common',
    })

    const { users, total } = await sut.execute({
      search: 'common',
      page: 1,
      limit: 20,
    })

    expect(users).toHaveLength(1)
    expect(users[0].type).toBe('common')
    expect(total).toBe(1)
  })

  it('should return paginated results', async () => {
    for (let i = 1; i <= 25; i++) {
      await usersRepository.create({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password: '1234',
        type: 'common',
      })
    }

    const { users: page1Users, total } = await sut.execute({
      page: 1,
      limit: 20,
    })

    const { users: page2Users } = await sut.execute({
      page: 2,
      limit: 20,
    })

    expect(page1Users).toHaveLength(20)
    expect(page2Users.length).toBeGreaterThan(5)
    expect(total).toBe(26) // 25 created users + default admin
  })
})
