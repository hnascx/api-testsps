import { usersRepository } from '@/repositories/in-memory'
import { PasswordMustBeFourCharactersError } from '@/use-cases/errors/password-must-be-four-characters-error'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeCreateUserUseCase } from '@/use-cases/factories/make-create-user-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const createUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  type: z.enum(['admin', 'common']),
  password: z.string(),
})

type CreateUserBody = z.infer<typeof createUserBodySchema>

export async function createUser(
  request: FastifyRequest<{ Body: CreateUserBody }>,
  reply: FastifyReply,
) {
  try {
    const { name, email, type, password } = createUserBodySchema.parse(
      request.body,
    )
    const createUserUseCase = makeCreateUserUseCase()

    await createUserUseCase.execute({
      name,
      email,
      type,
      password,
    })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    if (error instanceof PasswordMustBeFourCharactersError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }

  return reply.status(201).send()
}
