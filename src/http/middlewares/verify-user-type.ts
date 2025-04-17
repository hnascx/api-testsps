import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserType(typeToVerify: 'admin' | 'common') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { type } = request.user

    if (type !== typeToVerify) {
      return reply.status(401).send({ message: 'Unauthorized.' })
    }
  }
}
