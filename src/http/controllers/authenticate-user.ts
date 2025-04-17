import { usersRepository } from '@/repositories/in-memory'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUserUseCase } from '@/use-cases/factories/make-authenticate-user-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(4),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUserUseCase = makeAuthenticateUserUseCase()

    const { user } = await authenticateUserUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {
        type: user.type,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    return reply.status(200).send({
      token,
    })

    console.log(usersRepository.items)
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
