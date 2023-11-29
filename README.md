# rdf-transform-graph-imports

This package provides a stream transform which replaces import statements with contents of other graphs.

## Installation

Install the package itself and a RDF/JS environment which provides the factories [`NamespaceFactory`](https://github.com/rdfjs-base/namespace), [`FsUtilsFactory`](https://github.com/zazuko/rdf-utils-fs), and [`FetchFactory`](https://github.com/rdfjs-base/fetch-lite). If unsure, try [`@zazuko/env-node`](https://npm.im/@zazuko/env-node).

```bash
npm install rdf-transform-graph-imports @zazuko/env-node
```

## Preparation

First, you need a source graph which contains some import statements. An import statement is simply
a triple with predicate `code:imports` and an object which is a URI. The simple way is to have a
blank node on top of a document.

For example, you may want to extend the schema.org `Person` with a new property `identifier`:

```turtle
# shape.ttl
PREFIX shape: <http://example.com/shape>
PREFIX property: <http://example.com/shape#property>
PREFIX code: <https://code.described.at/>
PREFIX schema: <http://schema.org/>
PREFIX sh: <http://www.w3.org/ns/shacl#>

[
    # relative URIs are relative to the document itself
    code:imports <./property/identifier> ;
    code:imports <http://example.com/required-property> ;
] .

shape:
    a sh:NodeShape ;
    sh:targetClass schema:Person ;
    sh:property property:identifier ;
.

property:identifier 
    sh:path schema:identifier ;
    sh:and ( <http://example.com/required-property> ) ;
.
```

## Usage

The transform works in streaming mode. Thus, you need to provide a stream of quads as input and pipe
it through the transform. The transform will output a stream of quads where `code:imports` statements
are removed and replaced with the imported graphs. The latter can also contain import statements which
will be recursively resolved.

### From remote resource

```javascript
import rdf from '@zazuko/env-node'
import imports from 'rdf-transform-graph-imports'

const response = await rdf.fetch('https://example.com/shape.ttl')
const stream = await response.quadStream()

const dataset = await rdf.dataset().import(stream.pipe(imports(rdf)))
```

### From local file

When streaming a local file, it may be necessary to provide a `basePath` to resolve relative URIs.

```javascript
import rdf from '@zazuko/env-node'
import imports from 'rdf-transform-graph-imports'

const stream = rdf.fromFile('/path/to/shape.ttl')

const dataset = await rdf.dataset().import(stream.pipe(imports(rdf, {
    basePath: '/path/to/shape.ttl'
})))
```
