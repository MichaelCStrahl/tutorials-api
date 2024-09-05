import { generateSlug } from './generate-slug'

describe('Generate a slug', () => {
  it('should generate a slug from a title', () => {
    const title = 'Hello, World!'
    const expectedSlug = 'hello-world'

    const result = generateSlug(title)

    expect(result).toBe(expectedSlug)
  })

  it('should handle a multiple special characters and numbers', () => {
    const title = 'Hello, World! @#$%^&* 123'
    const expectedSlug = 'hello-world-123'

    const result = generateSlug(title)

    expect(result).toBe(expectedSlug)
  })

  it('should handle multiple spaces', () => {
    const title = '   Hello,   World!   '
    const expectedSlug = 'hello-world'

    const result = generateSlug(title)

    expect(result).toBe(expectedSlug)
  })

  it('should handle multiple consecutive hyphens', () => {
    const input = '---Hello---World---'
    const expectedOutput = 'hello-world'
    expect(generateSlug(input)).toBe(expectedOutput)
  })

  it('should handle a empty string', () => {
    const input = ''
    const expectedOutput = ''

    const result = generateSlug(input)

    expect(result).toBe(expectedOutput)
  })

  it('should handle non-ASCII characters', () => {
    const nonAsciiTitle = 'Título com caracteres especiais: ç, ã, ü'
    const expectedSlug = 'titulo-com-caracteres-especiais-c-a-u'

    expect(generateSlug(nonAsciiTitle)).toBe(expectedSlug)
  })
})
