import through2 from 'through2'
import type { AnyPointer } from 'clownface'
import type { Quad } from '@rdfjs/types'
import { resolveImport } from './lib/path.js'
import Environment from './lib/env.js'
import fetchImport from './lib/fetchImport.js'
import { log } from './lib/log.js'

function transform(env: Environment) {
  const code = env.namespace('https://code.described.at/')

  const importStatements: AnyPointer = env.clownface()

  return through2.obj(async function (quad: Quad, _, done) {
    if (quad.predicate.equals(code.imports) || quad.predicate.equals(code.extension)) {
      importStatements.dataset.add(quad)
      return done()
    }

    done(null, quad)
  }, async function (done) {
    try {
      const imports = importStatements.has(code.imports)
        .map(Import => {
          const importPath = Import.out(code.imports).term!
          const extension = Import.out(code.extension).value
          return resolveImport(importPath, { extension })
        })

      for (const importTarget of imports) {
        log.debug(`Importing ${importTarget}`)
        const fetchStream = await fetchImport(env, importTarget)
        const importStream = fetchStream.pipe(transform(env))

        for await (const importedQuad of importStream) {
          this.push(importedQuad)
        }
      }
    } catch (e: unknown) {
      this.destroy(new Error(`Failed to import: ${e}`))
    }

    done()
  })
}

export default transform
