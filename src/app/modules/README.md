# Modules

Modules allow to extend the Situational Business Model Developer (SBMD)
by adding new Methods for the enaction.

There are two types of modules that can extend the SBMD. These are:

- Tool Modules: Tool modules allow to add execution steps to the SBMD that
  can be added to Method Building Blocks and are executed in the
  enaction of a Development Method.
- Meta Artifact Modules: Meta Artifact modules are used to add new meta artifact
  definitions to the SBMD. Meta artifact definitions can be used to define the underling
  meta artifact of artifacts, i.e., the underlying structure of the data stored in them.

**Why this separation?** This separation allows different tool modules to
share meta artifact definitions, e.g., there could be a tool model that
converts between different meta artifacts to increase the interoperability.

## Current Modules

Currently, there are three modules:

- Canvas
- HypoMoMap
- Whiteboard

Each of these three has a tool module and a meta artifact module defined.

## How to add a new Module

### Prerequisites

Before you can use any of our schematics, you must build them.
To do this, go to the folder `module-schematics` and run `npm install`
and then `npm build`. After that, you can run our schematics from
the root of the repository.

### Meta Artifact Module

Run the following command

```
ng generate ./module-schematics:meta-artifact-module
```

Additionally, add the meta artifact module (`*MetaArtifactModule`) in the `imports` section
of `app.module.ts`. The star (`*`) stands for your chosen module name.

The command already creates a basic meta artifact module with a single
definition. You need to adapt the names in `*-meta-artifact.service.ts`.
Furthermore, you need to implement the methods in `*-meta-artifact-api.service.ts` to
describe how to copy and remove meta artifacts, and how to get a default name
for meta artifacts. Currently, all modules are using the default database to store their
meta artifacts, you can look into the example meta artifact module for an easy example.

The command also created some `register`-methods. These can be used by tool modules
to register themselves as methods to create, edit, and view meta artifacts. It is up to you
whether you want to implement these methods directly inside the meta artifact module or via registration
in a tool module. Currently, only the latter option is used.

### Tool Module

Run the following command

```
ng generate ./module-schematics:tool-module
```

Additionally, add the tool module (`*ToolModule`) in the `imports` section
of `app.module.ts`. The star (`*`) stands for your chosen module name.

The command already creates a basic tool module with some basic services.
Your main task is to add module definitions in `*-tool.service.ts` and implement them
in `*-tool-api.service.ts`.

Currently, all modules are implemented as a part of the angular application and use some helpers from
the `SharedModule`, e.g., `ApiNavigationComponent`.
For a simple example you can look into the example tool module.

It is also possible to do other things. Every time a user hits the
execution button and your execution step is the current execution step
the `executeMethod` method in `*-tool-api.service.ts` is called with some
information, like the method name. You can then do whatever you want. The only thing
that should happen is that, after the execution of your execution step is finished,
the method `finishExecuteStep` of `RunningProcessService` has to be called. A helper for this is in
`*-tool-resolve.service.ts`.

#### Execution Step (Method) Definition

You have to define execution steps (internally called methods), in
the `*-tool.service.ts`. Every execution step definition has to be of type `ModuleMethod`.
More information can be found in the documentation of the type `ModuleMethod`.
