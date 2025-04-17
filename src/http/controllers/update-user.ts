import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { IncorrectPasswordError } from '@/use-cases/errors/incorrect-password-error'
import { NewPasswordsDoNotMatchError } from '@/use-cases/errors/new-passwords-do-not-match-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeUpdateUserUseCase } from '@/use-cases/factories/make-update-user-use-case'
import { PasswordMustBeFourCharactersError } from '@/use-cases/errors/password-must-be-four-characters-error'

const updateUserBodySchema = z.object({
  name: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmNewPassword: z.string().optional(),
})

type UpdateUserBody = z.infer<typeof updateUserBodySchema>

export async function updateUser(
  request: FastifyRequest<{
    Body: UpdateUserBody
  }>,
  reply: FastifyReply,
) {
  const userId = request.user.sub

  const { name, currentPassword, newPassword, confirmNewPassword } =
    updateUserBodySchema.parse(request.body)

  try {
    const updateUserUseCase = makeUpdateUserUseCase()

    const { user } = await updateUserUseCase.execute({
      userId,
      name,
      currentPassword,
      newPassword,
      confirmNewPassword,
    })

    const maskedPassword = '*'.repeat(user.password.length)

    return reply.status(200).send({
      user: {
        ...user,
        type: undefined,
        password: maskedPassword,
      },
    })
  } catch (error) {
    if (error instanceof PasswordMustBeFourCharactersError) {
      return reply.status(400).send({ message: error.message })
    }

    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof IncorrectPasswordError) {
      return reply.status(400).send({ message: error.message })
    }

    if (error instanceof NewPasswordsDoNotMatchError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
