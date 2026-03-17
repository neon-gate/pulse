/**
 * Transaction boundary helper.
 *
 * @example
 * await uow.withTransaction(async () => {
 *   await repo.save(order)
 * })
 */
export abstract class UnitOfWork {
  abstract begin(): Promise<void>
  abstract commit(): Promise<void>
  abstract rollback(): Promise<void>

  async withTransaction<T>(fn: () => Promise<T>): Promise<T> {
    await this.begin()
    try {
      const result = await fn()
      await this.commit()
      return result
    } catch (error) {
      await this.rollback()
      throw error
    }
  }
}
