# Modularization for Situations-specific Business Model Development
We provide the Situational Business Model Developer with a modularized architecture for our approach. In the following, we present how every development support engineer can create a wrapper for his own modules. For that, we allow the generation of modules for meta artifacts as well as support tools using Angular Schematics.

## Creation of new Modules
The creation of new modules can be divided into meta artifacts and support tools.

- SupportTool Modules: Tool modules allow to add execution steps to the SBMD that
  can be added to Method Building Blocks and are executed in the
  enaction of a Development Method.
- MetaArtifact Modules: Artifact modules are used to add new metamodel
  definitions to the SBMD. Metamodel definitions can be used to define the underling
  metamodel of artifacts.

**Why this separation?** This separation allows different tool modules to
share metamodel definitions, e.g., there could be a tool model that
converts between different metamodels to increase the interoperability.


### MetaArtifact Module

Run the following command

```
ng generate ./module-schematics:artifact-module
```

Additionally, add the artifact module (`*ArtifactModule`) in the `imports` section
of `app.module.ts`. The star (`*`) stands for your chosen module name.

The command already creates a basic artifact module with a single
definition. You need to adapt the names in `*-artifact.service.ts`.
Furthermore, you need to implement the methods in `*-artifact-api.service.ts` to
describe how to copy and remove artifacts, and how to get a default name
for artifacts. Currently, all modules are using the default database to store their
artifacts, you can look into the example artifact module for an easy example.

The command also created some `register`-methods. These can be used by tool modules
to register themselves as methods to create, edit, and view artifacts. It is up to you
whether you want to implement these methods directly inside the artifact module or via registration
in a tool module. Currently, only the latter option is used.

### SupportTool Module

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


