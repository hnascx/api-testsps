export class NewPasswordsDoNotMatchError extends Error {
  constructor() {
    super('New password do not match.')
  }
}
