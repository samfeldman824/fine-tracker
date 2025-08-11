import { describe, it, expect } from 'vitest'

describe('Basic Test Suite', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should verify basic JavaScript functionality', () => {
    const message = 'Hello, CI!'
    expect(message).toBe('Hello, CI!')
  })
})