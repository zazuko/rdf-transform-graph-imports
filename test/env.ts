import { create } from '@zazuko/env-node'
import formats from '@rdfjs-elements/formats-pretty'

const env = create()

env.formats.import(formats)

export default env
