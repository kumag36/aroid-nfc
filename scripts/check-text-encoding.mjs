import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const roots = ['app', 'lib', 'scripts']
const extensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.mjs', '.md'])
const mojibakeChars = [
  0x7e3a,
  0x7e67,
  0x7e5d,
  0x8b41,
  0x9afb,
  0x8b8c,
  0x87b3,
  0x8712,
  0x9015,
  0x9082,
  0x8b17,
  0x9ad1,
  0x83a0,
  0x8b5b,
  0x9052,
  0x8757,
  0x873f,
  0x8c82,
  0xfffd,
].map((code) => String.fromCharCode(code))

function extensionOf(filePath) {
  const match = filePath.match(/\.[^.]+$/)
  return match ? match[0] : ''
}

function collectFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    const stats = statSync(path)
    if (stats.isDirectory()) {
      collectFiles(path, files)
      continue
    }
    if (extensions.has(extensionOf(path))) {
      files.push(path)
    }
  }
  return files
}

const findings = []

for (const root of roots) {
  for (const file of collectFiles(root)) {
    const text = readFileSync(file, 'utf8')
    const lines = text.split(/\r?\n/)
    lines.forEach((line, index) => {
      if (mojibakeChars.some((char) => line.includes(char))) {
        findings.push(`${relative(process.cwd(), file)}:${index + 1}: ${line.trim()}`)
      }
    })
  }
}

if (findings.length > 0) {
  console.error('Mojibake-like text was found. Fix these lines before build:')
  console.error(findings.join('\n'))
  process.exit(1)
}

console.log('Text encoding check passed.')
