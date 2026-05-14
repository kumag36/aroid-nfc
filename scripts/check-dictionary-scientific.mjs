import { readFileSync } from 'node:fs'

const text = readFileSync('lib/dictionary-data.ts', 'utf8')
const displayNamePattern = /displayName:\s*(['"])(.*?)\1/g
const findings = []

for (const match of text.matchAll(displayNamePattern)) {
  const name = match[2]
  if (name.includes('\u3000')) {
    findings.push(`${name} contains full-width spaces. Use ASCII spaces.`)
  }
  if (/[^\x20-\x7E]/.test(name)) {
    findings.push(`${name} contains non-ASCII characters.`)
  }
  if (/[Ａ-Ｚａ-ｚ０-９]/.test(name)) {
    findings.push(`${name} contains full-width alphanumeric characters.`)
  }
  if (/[“”‘’]/.test(name)) {
    findings.push(`${name} contains smart quotes. Use ASCII apostrophes.`)
  }
}

if (findings.length > 0) {
  console.error('Dictionary scientific names must use half-width ASCII characters:')
  console.error(findings.join('\n'))
  process.exit(1)
}

console.log('Dictionary scientific name check passed.')
