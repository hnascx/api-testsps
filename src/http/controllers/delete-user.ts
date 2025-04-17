import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeDeleteUserUseCase } from '@/use-cases/factories/make-delete-user-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { CannotDeleteInitialAdminUserError } from '@/use-cases/errors/cannot-delete-initial-admin-user-error'

const deleteUserParamsSchema = z.object({
  userId: z.string(),
})

type DeleteUserByAdminParams = z.infer<typeof deleteUserParamsSchema>

export async function deleteUser(
  request: FastifyRequest<{ Params: DeleteUserByAdminParams }>,
  reply: FastifyReply,
) {
  const { userId } = deleteUserParamsSchema.parse(request.params)

  try {
    const deleteUser = makeDeleteUserUseCase()

    await deleteUser.execute({ userId })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof CannotDeleteInitialAdminUserError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
