type Brand<K, T> = K & { __brand: T }

export type Progress = Brand<number, 'Progress'>
