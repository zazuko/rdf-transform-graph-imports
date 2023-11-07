import * as url from 'url'
import type { Term } from '@rdfjs/types'
import isURI from 'is-uri'

export function resolveImport(importNode: Term, basePath: string | URL | undefined) {
  if (importNode.termType !== 'NamedNode') {
    throw new Error(`Import target must be a NamedNode, got ${importNode.termType}`)
  }

  if (isURI(importNode.value)) {
    return new URL(importNode.value)
  }

  const base = typeof basePath === 'string' ? url.pathToFileURL(basePath) : basePath
  return url.fileURLToPath(new URL(importNode.value + '.ttl', base))
}
