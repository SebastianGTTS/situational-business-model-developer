# Example module

This is an example module to see how a module is constructed.
It is less complex than the production modules (e.g., Canvas,
HypoMoMaps, Whiteboard), but **not** minimal, because it contains
best practices how to construct a module.

The module is not enabled by default. To enable it uncomment the
lines in `app.module.ts`.

The example module is split up into the tool and artifact module.

## Example artifact module

The example artifact module shows how to create an artifact
metamodel. The artifact metamodel consists only of a name and
a description. To save this data the database provided by
the SBMD is used.

## Example tool module

The example tool module shows how to create a tool module that
contains execution steps for method building blocks that are
executed in the enaction. The method contains the steps create,
edit, and view. The steps are also registered at the example
artifact module to provide methods to create, edit, and view
examples manually.
