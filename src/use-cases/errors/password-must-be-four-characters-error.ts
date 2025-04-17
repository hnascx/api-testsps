export class PasswordMustBeFourCharactersError extends Error {
  constructor() {
    super('Password must be at least 4 characters long.')
  }
}
