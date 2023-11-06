import * as url from 'url'
import type { Term } from '@rdfjs/types'

export function resolveImport(importNode: Term, basePath: string | URL) {
  if (importNode.termType !== 'NamedNode') {
    throw new Error(`Import target must be a NamedNode, got ${importNode.termType}`)
  }

  const base = typeof basePath === 'string' ? url.pathToFileURL(basePath) : basePath
  const importTarget = new URL(importNode.value + '.ttl', base)

  return url.fileURLToPath(importTarget)
}
