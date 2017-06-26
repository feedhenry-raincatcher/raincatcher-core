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

In order to use this module, begin by installing all dependencies:

If inside the [lerna](http://lernajs.io)-based mono repo: `lerna bootstrap --scope=@raincatcher/wfm --include-filtered-dependencies`

For standalone usage: `npm install`

For implementing a base flow, see the [examples folder](./examples/).

## Event-based tracking of Task progress

Tasks and related entities emit events upon changing state, most of the regular progression should be between states in the [`TaskStatus` enumeration](./src/task/Task.ts), and custom states should fall under one of those as categories. See the [next section](#utilizing-custom-states) to learn how to utilize custom states.

Through those events, both UI components and extra processing logic can hook into the life cycle of a Task in order to trigger other actions or update visible information for the user.

### Utilizing custom states

The [`TaskStatus` enumeration](./src/task/Task.ts) utilizes each hundredth number to represent a status that is expected to have semantic meaning for UI components and business logic.

To define own custom states in addition to the ones available, simply utilize an arbitrary number between the status the custom one fits under and the next.

For example, a special `const NEEDS_APPROVAL = 1` status would be rounded down to `0 === TaskStatus.PENDING`, thus considered pending by other components that don't have specific logic to process the custom status.
