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
export abstract class UseCase<TArgs extends unknown[], TResult> {
  abstract execute(...args: TArgs): Promise<TResult>
}
