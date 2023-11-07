import { Readable, PassThrough } from 'readable-stream'
import Environment from './env.js'

export default function (env: Environment, importTarget: string | URL) {
  if (typeof importTarget === 'string') {
    return env.fromFile(importTarget)
  }

  const remoteStream = new PassThrough({ objectMode: true })

  env.fetch(importTarget.toString())
    .then(response => {
      return response.quadStream() as unknown as Promise<Readable>
    })
    .then(quadStream => {
      quadStream.pipe(remoteStream)
    })
    .catch(error => {
      remoteStream.emit('error', error)
    })

  return remoteStream
}
