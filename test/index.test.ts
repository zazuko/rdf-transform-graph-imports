import * as url from 'url'
import * as http from 'http'
import chai, { expect } from 'chai'
import type { Dataset } from '@zazuko/env/lib/Dataset.js'
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot'
import { Readable } from 'readable-stream'
import transform from '../index.js'
import rdf from './env.js'
import { start } from './server/index.js'

chai.use(jestSnapshotPlugin())

describe('rdf-merge-stream', () => {
  let server: http.Server

  before(() => {
    server = start().listen(6666)
  })

  after(() => {
    server.close()
  })

  it('merges file stream by relative path', async () => {
    // given
    const path = new URL('./resources/import-relative.ttl', import.meta.url)
    const root = rdf.fromFile(url.fileURLToPath(path.toString()))

    // when
    const merged = await rdf.dataset().import(root.pipe(transform(rdf, {
      basePath: path,
    })))

    // then
    expect(await turtle(merged)).toMatchSnapshot()
  })

  it('imports remote resources from files', async () => {
    // given
    const path = new URL('./resources/import-remote.ttl', import.meta.url)
    const root = rdf.fromFile(url.fileURLToPath(path.toString()))

    // when
    const merged = await rdf.dataset().import(root.pipe(transform(rdf, {
      basePath: path,
    })))

    // then
    expect(await turtle(merged)).toMatchSnapshot()
  })

  it('imports remote resources from http', async () => {
    // given
    const response = await rdf.fetch('http://localhost:6666/shape')
    const root = await response.quadStream() as unknown as Readable

    // when
    const merged = await rdf.dataset().import(root.pipe(transform(rdf)))

    // then
    expect(await turtle(merged)).toMatchSnapshot()
  })
})

async function turtle(merged: Dataset) {
  return merged.serialize({ format: 'text/turtle', prefixes: ['sh', 'schema'] })
}
