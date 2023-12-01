import { Readable } from 'readable-stream'
import Environment from './env.js'

export default async function (env: Environment, importTarget: string | URL) {
  if (typeof importTarget === 'string') {
    return env.fromFile(importTarget, { implicitBaseIRI: true })
  }

  const response = await env.fetch(importTarget.toString())
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`)
  }

  return response.quadStream() as unknown as Promise<Readable>
}
