import * as url from 'url'
import chai, { expect } from 'chai'
import type { Dataset } from '@zazuko/env/lib/Dataset.js'
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot'
import transform from '../index.js'
import rdf from './env.js'

chai.use(jestSnapshotPlugin())

describe('rdf-merge-stream', () => {
  it('merges file stream by relative path', async () => {
    // given
    const path = new URL('./resources/relative.ttl', import.meta.url)
    const root = rdf.fromFile(url.fileURLToPath(path.toString()))

    // when
    const merged = await rdf.dataset().import(root.pipe(transform(rdf, {
      basePath: path,
    })))

    // then
    expect(await turtle(merged)).toMatchSnapshot()
  })
})

async function turtle(merged: Dataset) {
  return merged.serialize({ format: 'text/turtle', prefixes: ['sh', 'schema'] })
}
