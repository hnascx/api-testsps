import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function getUserProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserProfile = makeGetUserProfileUseCase()

  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  })

  const isAdmin = request.user.type === 'admin'

  return reply.status(200).send({
    user: {
      id: undefined,
      name: user.name,
      email: user.email,
      ...(isAdmin && { type: user.type }),
      password: undefined,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  })
}
