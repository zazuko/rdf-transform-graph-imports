import * as url from 'url'
import type { Term } from '@rdfjs/types'
import { log } from './log.js'

interface Options {
  extension?: string
}

export function resolveImport(importNode: Term, { extension }: Options = {}) {
  if (importNode.termType !== 'NamedNode') {
    throw new Error(`Import target must be a NamedNode. Got ${importNode.termType}`)
  }

  try {
    const targetUri = new URL(importNode.value)
    if (targetUri.protocol === 'http:') {
      return targetUri
    }

    if (extension) {
      targetUri.pathname += `.${extension}`
    }

    return url.fileURLToPath(targetUri)
  } catch (e: unknown) {
    log.error(e)
    throw new Error(`Import target must be a valid URI. Got: ${importNode.value}`)
  }
}
