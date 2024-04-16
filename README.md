# rdf-transform-graph-imports

This package provides a stream transform which replaces import statements with contents of other graphs.

## Installation

Install the package itself and an RDF/JS environment which provides the factories [`NamespaceFactory`](https://github.com/rdfjs-base/namespace),  [`FetchFactory`](https://github.com/rdfjs-base/fetch-lite), and, optionally, [`FsUtilsFactory`](https://github.com/zazuko/rdf-utils-fs). If unsure, try [`@zazuko/env-node`](https://npm.im/@zazuko/env-node).

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
    code:imports <./property/identifier.ttl> ;
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

It is required that all imports are absolute URIs in the upstream. If you parse documents yourself,
make sure to provide a base IRI so that relative URIs are resolved correctly. The easiest way is to
use the libraries as shown below.

### From remote resource

The `rdf.fetch` method ensures that relative URIs in the response are parsed against the URL of the
document itself by default.

```javascript
import rdf from '@zazuko/env-node'
import imports from 'rdf-transform-graph-imports'

const response = await rdf.fetch('https://example.com/shape.ttl')
const stream = await response.quadStream()

const dataset = await rdf.dataset().import(stream.pipe(imports(rdf)))
```

### From local file

When streaming a local file, you must explicitly provide a base IRI to the parser or use the option
to use the file's path as base IRI. This is not the default behaviour of the `rdf.fromFile` function 
because prior users may rely on the parser to return relative URIs at face value.

```javascript
import rdf from '@zazuko/env-node'
import imports from 'rdf-transform-graph-imports'

const stream = rdf.fromFile('/path/to/shape.ttl', { implicitBaseIRI: true })

const dataset = await rdf.dataset().import(stream.pipe(imports(rdf)))
```

### Reusing imports for local and remote documents

You may face the situation that you want to import the same file from a local file and a remote resource
but do not publish the extension in the remote resource's URL. In this case, you must add a `code:extension`
property to the import.

```turtle
PREFIX code: <https://code.described.at/>

[
    code:imports <./property/identifier> ;
    code:extension "ttl" ;
] .
```

If the above is a local file, e.g. `/path/to/shape.ttl`, the import will be resolved as `/path/to/property/identifier.ttl`.

If the above is a remote resource, e.g. `https://example.com/shape`, the import will be resolved as `https://example.com/property/identifier.ttl`.
