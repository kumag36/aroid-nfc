import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const roots = ['app/admin', 'app/nfc/verify']
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx'])
const forbiddenPatterns = [
  /#[0-9a-fA-F]{3,8}/,
  /\bbg-white\b/,
  /\btext-white\b/,
  /\bbg-gray-\d+\b/,
  /\btext-gray-\d+\b/,
  /\bborder-gray-\d+\b/,
]

function extensionOf(file) {
  const index = file.lastIndexOf('.')
  return index === -1 ? '' : file.slice(index)
}

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    const stats = statSync(path)
    if (stats.isDirectory()) return walk(path)
    return extensions.has(extensionOf(path)) ? [path] : []
  })
}

const findings = roots
  .flatMap((root) => walk(root))
  .flatMap((file) => {
    const text = readFileSync(file, 'utf8')
    return text
      .split(/\r?\n/)
      .map((line, index) => ({ file, line, lineNumber: index + 1 }))
      .filter(({ line }) => forbiddenPatterns.some((pattern) => pattern.test(line)))
  })

if (findings.length > 0) {
  console.error('Admin color check failed. Use zmk-admin-* classes or theme variables instead of hard-coded colors:')
  for (const finding of findings) {
    console.error(`- ${relative(process.cwd(), finding.file)}:${finding.lineNumber} ${finding.line.trim()}`)
  }
  process.exit(1)
}

console.log('Admin color check passed.')
