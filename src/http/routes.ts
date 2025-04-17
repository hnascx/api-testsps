import { FastifyInstance } from 'fastify'
import { createUser } from './controllers/create-user'
import { authenticateUser } from './controllers/authenticate-user'
import { getUserProfile } from './controllers/get-user-profile'
import { verifyJWT } from './middlewares/verify-jwt'
import { verifyUserType } from './middlewares/verify-user-type'
import { listUsers } from './controllers/list-users'
import { updateUserByAdmin } from './controllers/update-user-by-admin'
import { deleteUser } from './controllers/delete-user'
import { updateUser } from './controllers/update-user'

export async function appRoutes(app: FastifyInstance) {
  app.post('/login', authenticateUser)

  app.get(
    '/users',
    { onRequest: [verifyJWT, verifyUserType('admin')] },
    listUsers,
  )

  app.post(
    '/users',
    { onRequest: [verifyJWT, verifyUserType('admin')] },
    createUser,
  )

  app.put(
    '/users/:userId',
    { onRequest: [verifyJWT, verifyUserType('admin')] },
    updateUserByAdmin,
  )

  app.delete(
    '/users/:userId',
    { onRequest: [verifyJWT, verifyUserType('admin')] },
    deleteUser,
  )

  app.get('/me', { onRequest: [verifyJWT] }, getUserProfile)

  app.put('/me/:userId', { onRequest: [verifyJWT] }, updateUser)
}
