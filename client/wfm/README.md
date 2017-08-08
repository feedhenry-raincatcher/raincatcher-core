## RainCatcher WFM

RainCatcher **W**ork**F**low **M**anagement module is an TypeScript implementation for an equivalent subset of the [BPMN specification](http://www.bpmn.org/).

This module allows users to map business process into an organized set of tasks that can be built by developers to suit business needs.

## Concepts

The WFM module consists of a set of TypeScript interfaces and implementations for Process Management. The main entities are described bellow:

* `WorkFlow`: contain an ordered set of definitions of `Step`s, to be instantiated into a `WorkOrder` for execution
* `WorkOrder`: instance of a `WorkFlow` to be executed
* `Step`: defines single unit of work
* `StepResult`: the output of the execution of a `Step`
* `WorkOrderResult`: The tracking of the progress of a `WorkOrder`

The classes are framework-agnostic, allowing developers to focus on the implementation of Business Process on top of any new or existing solution.

## Getting Started

In order to use this module, begin by installing all dependencies:

If inside the [lerna](http://lernajs.io)-based mono repo: `lerna bootstrap --scope=@raincatcher/wfm --include-filtered-dependencies`

For standalone usage: `npm install`
