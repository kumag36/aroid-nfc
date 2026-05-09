import { existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const projectRoot = process.cwd()
const targets = [
  resolve(projectRoot, '.next', 'dev', 'cache', 'turbopack'),
  resolve(projectRoot, '.next', 'cache', 'webpack'),
]

for (const target of targets) {
  if (!target.startsWith(resolve(projectRoot, '.next'))) {
    throw new Error(`Refusing to remove path outside .next: ${target}`)
  }

  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true })
    console.log(`Removed ${target}`)
  }
}

console.log('Next dev cache cleanup complete.')
