import { FastifyRequest, FastifyReply } from 'fastify'
import { makeListUsersUseCase } from '@/use-cases/factories/make-list-users-use-case'
import { z } from 'zod'

const listUsersQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
})

type ListUsersQuery = z.infer<typeof listUsersQuerySchema>

export async function listUsers(
  request: FastifyRequest<{ Querystring: ListUsersQuery }>,
  reply: FastifyReply,
) {
  const { search, page } = listUsersQuerySchema.parse(request.query)

  const listUsersUseCase = makeListUsersUseCase()

  const { users, total } = await listUsersUseCase.execute({
    search,
    page,
    limit: 20,
  })

  return reply.status(200).send({
    users,
    total,
    page,
    perPage: 20,
    totalPages: Math.ceil(total / 20),
  })
}
