import through2 from 'through2'
import type { Quad } from '@rdfjs/types'
import { resolveImport } from './lib/path.js'
import Environment from './lib/env.js'
import fetchImport from './lib/fetchImport.js'

interface Options {
  basePath?: string | URL
}

function transform(env: Environment, { basePath }: Options = {}) {
  const code = env.namespace('https://code.described.at/')

  return through2.obj(async function (quad: Quad, _, done) {
    if (quad.predicate.equals(code.imports)) {
      try {
        const importTarget = resolveImport(quad.object, basePath)
        const importStream = fetchImport(env, importTarget)
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
