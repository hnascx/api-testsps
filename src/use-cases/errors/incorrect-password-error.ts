export class IncorrectPasswordError extends Error {
  constructor() {
    super('Incorrect password.')
  }
}
