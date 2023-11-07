import type { Environment as RdfjsEnvironment } from '@rdfjs/environment/Environment.js'
import type { NamespaceFactory } from '@rdfjs/namespace/Factory.js'
import type FsUtilsFactory from '@zazuko/rdf-utils-fs/Factory.js'
import type { FetchFactory } from '@rdfjs/fetch-lite/Factory.js'

type Environment = RdfjsEnvironment<NamespaceFactory | FsUtilsFactory | FetchFactory>
export default Environment
