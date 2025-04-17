import { IncorrectPasswordError } from '@/use-cases/errors/incorrect-password-error'
import { NewPasswordsDoNotMatchError } from '@/use-cases/errors/new-passwords-do-not-match-error'
import { PasswordMustBeFourCharactersError } from '@/use-cases/errors/password-must-be-four-characters-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeUpdateUserByAdminUseCase } from '@/use-cases/factories/make-update-user-by-admin-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const updateUserByAdminParamsSchema = z.object({
  userId: z.string(),
})

const updateUserByAdminBodySchema = z.object({
  name: z.string().optional(),
  type: z.enum(['admin', 'common']).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmNewPassword: z.string().optional(),
})

type UpdateUserByAdminParams = z.infer<typeof updateUserByAdminParamsSchema>
type UpdateUserByAdminBody = z.infer<typeof updateUserByAdminBodySchema>

export async function updateUserByAdmin(
  request: FastifyRequest<{
    Params: UpdateUserByAdminParams
    Body: UpdateUserByAdminBody
  }>,
  reply: FastifyReply,
) {
  const { userId } = updateUserByAdminParamsSchema.parse(request.params)

  const { name, type, currentPassword, newPassword, confirmNewPassword } =
    updateUserByAdminBodySchema.parse(request.body)

  try {
    const updateUserUseCase = makeUpdateUserByAdminUseCase()

    const { user } = await updateUserUseCase.execute({
      userId,
      name,
      type,
      currentPassword,
      newPassword,
      confirmNewPassword,
    })

    const maskedPassword = '*'.repeat(user.password.length)

    return reply.status(200).send({
      user: {
        ...user,
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
