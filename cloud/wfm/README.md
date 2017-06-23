## RainCatcher WFM

RainCatcher **W**ork**f**low **M**anagement module is an TypeScript implementation for a subset of the [BPMN specification](http://www.bpmn.org/).

This module allows users to map business process into an organized set of tasks that can be built by developers to suit business needs.

## Concepts

The WFM module consists of a set of TypeScript interfaces and implementations for Process Management. The main entities are described bellow:

* `Process`: contain ordered set of tasks and handlers for executing `Tasks` in proper order

* `ProcessInstance`: instance of process containing current progress

* `Result`: meta interface that maps different types of results from `Task` execution

* `Task`: defines single unit of work for `Process`

* `Executor`: transforms Process into ProcessInstance and allows to control transitions between `Tasks`

Users can write custom `Task`s that will implement any business logic and link implementation with any UI solution.

THe classes are framework-agnostic, allowing developers to focus on the implementation of Business Process on top of any new or existing solution.

## Getting Started

Install all dependencies:

If inside the [lerna](http://lernajs.io)-based mono repo: `lerna bootstrap --scope=@raincatcher/wfm --include-filtered-dependencies`

For standalone usage: `npm install`

For implementing a base flow, see the [examples folder](./examples/).


## Event-based tracking of Task progress

Tasks emit events upon changing states,

### Utilizing custom states
