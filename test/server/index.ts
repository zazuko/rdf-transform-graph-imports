import * as url from 'url'
import * as path from 'path'
import express from 'express'
import * as absoluteUrl from 'absolute-url'
import rdfHandler from '@rdfjs/express-handler'
import env from '../env.js'

const __dirname = url.fileURLToPath(new URL('resources', import.meta.url))

export function start() {
  return express()
    .use(rdfHandler())
    .use(absoluteUrl.middleware())
    .get('/*', (req, res) => {
      res.setHeader('Content-Type', 'text/turtle')

      const quads = env.fromFile(path.join(__dirname, `${req.path}.ttl`), {
        baseUri: req.absoluteUrl(),
      })

      res.quadStream(quads)
    })
}
