import * as url from 'url'
import type { Term } from '@rdfjs/types'
import isURI from 'is-uri'

interface Options {
  basePath?: string | URL
  extension?: string
}

export function resolveImport(importNode: Term, { basePath, extension }: Options = {}) {
  if (importNode.termType !== 'NamedNode') {
    throw new Error(`Import target must be a NamedNode, got ${importNode.termType}`)
  }

  if (isURI(importNode.value)) {
    return new URL(importNode.value)
  }

  const base = typeof basePath === 'string' ? url.pathToFileURL(basePath) : basePath

  const filePath = extension ? `${importNode.value}.${extension}` : importNode.value
  return url.fileURLToPath(new URL(filePath, base))
}
