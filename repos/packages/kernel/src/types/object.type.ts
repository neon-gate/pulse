/**
 * Map type for domain-to-payload associations.
 *
 * @example
 * type OrderEvents = ObjectType<'Order'>
 * const payload: ObjectType<'Order'> = new Map([['Order', { id: 'o-1' }]])
 */
export type ObjectType<Domain> = Map<Domain, unknown>
