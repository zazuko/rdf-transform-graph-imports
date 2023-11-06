import through2 from 'through2'
import type { Environment as RdfjsEnvironment } from '@rdfjs/environment/Environment.js'
import type { NamespaceFactory } from '@rdfjs/namespace/Factory.js'
import type { FetchFactory } from '@rdfjs/fetch-lite/Factory.js'
import type FsUtilsFactory from '@zazuko/rdf-utils-fs/Factory.js'
import type { Quad } from '@rdfjs/types'
import { resolveImport } from './lib/path.js'

type Environment = RdfjsEnvironment<NamespaceFactory | FsUtilsFactory | FetchFactory>

interface Options {
  basePath: string | URL
}

function transform(env: Environment, { basePath }: Options) {
  const code = env.namespace('https://code.described.at/')

  return through2.obj(async function (quad: Quad, _, done) {
    if (quad.predicate.equals(code.imports)) {
      try {
        const importTarget = resolveImport(quad.object, basePath)
        const importStream = env.fromFile(importTarget)
          .pipe(transform(env, { basePath: importTarget }))

        for await (const importedQuad of importStream) {
          this.push(importedQuad)
        }

        return done()
      } catch (e) {
        return done(e)
      }
    }

    done(null, quad)
  })
}

export default transform
