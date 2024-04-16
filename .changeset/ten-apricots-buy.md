---
"rdf-transform-graph-imports": patch
---

Make the `FsUtilsFactory` optional. An exception will be thrown when an enviornment does not provide that factory and a filesystem import is loaded
