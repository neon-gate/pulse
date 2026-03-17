/**
 * Base use case contract.
 *
 * @example
 * class GetUser extends UseCase<[string], User> {
 *   async execute(userId: string): Promise<User> {
 *     return this.repo.get(userId)
 *   }
 * }
 */
export abstract class UseCase<Args extends unknown[], Result> {
  abstract execute(...args: Args): Promise<Result>
}
