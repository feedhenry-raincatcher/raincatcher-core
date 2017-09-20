## RainCatcher WFM

RainCatcher **W**ork**F**low **M**anagement module is an TypeScript implementation for an equivalent subset of the [Business Process Model and Notation (BPMN) specification](http://www.bpmn.org/).

This module allows users to map a business process into an organized set of tasks that can be built by developers to suit business needs.

## Concepts

The WFM module consists of a set of TypeScript interfaces and implementations for Process Management. The module's main entities are:

* `WorkFlow`: contains an ordered set of definitions of `Step`s than are instantiated into a `WorkOrder` for execution
* `WorkOrder`: instance of a `WorkFlow` to be executed
* `Step`: defines a single unit of work
* `StepResult`: the output of the execution of a `Step`
* `WorkOrderResult`: Tracks the progress of a `WorkOrder`

The classes are framework-agnostic which allows a developer to focus on the implementation of Business Processes on top of any new or existing solution.

## Getting Started

1) install all dependencies:

If inside the [lerna](http://lernajs.io)-based mono repo: `lerna bootstrap --scope=@raincatcher/wfm --include-filtered-dependencies`

2) For standalone usage: `npm install`
