# rdf-transform-graph-imports

## 0.2.3

### Patch Changes

- 797c97e: Make the `FsUtilsFactory` optional. An exception will be thrown when an enviornment does not provide that factory and a filesystem import is loaded

## 0.2.2

### Patch Changes

- 9996328: Log raw error when path resolution fails
- 3888a4c: Fix error when resolving HTTPS imports

## 0.2.1

### Patch Changes

- 4ca309b: Add log when import is resolved

## 0.2.0

### Minor Changes

- d42f222: When importing local files, add support for `code:extension` to keep `code:imports` same in both local and web documents
- 8b4642d: Require that all URIs in stream are absolute

### Patch Changes

- 7ed5019: Failures to fetch remote import would break the stream

## 0.1.0

### Minor Changes

- 11bdade: First implementation of importing by relative path and from the web
