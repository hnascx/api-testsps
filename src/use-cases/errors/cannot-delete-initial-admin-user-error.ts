export class CannotDeleteInitialAdminUserError extends Error {
  constructor() {
    super('The initial admin user cannot be deleted.')
  }
}
