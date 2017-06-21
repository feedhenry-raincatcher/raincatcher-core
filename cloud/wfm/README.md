## RainCatcher WFM

RainCatcher Workflow Management module is an TypeScript implementation for subset of the BPMN specification. Module allows to map buiness process into organized set of tasks that can be build by developers to suit business needs.

## Concepts

WFM module consist of the set of the TypeScript interfaces and implementations for Process Management. Most important interfaces were described bellow:

* `Process`: contain ordered set of tasks and handlers for executing `Tasks` in proper order

* `ProcessInstance`: instance of process containing current progress

* `Result`: meta interface that maps different types of results from `Task` execution

* `Task`: defines single unit of work for `Process`

* `Executor`: transforms Process into ProcessInstance and allows to control transitions between `Tasks`

Users can write custom Tasks that will implement any business logic and link implementation with any UI solution. Framework abstract from any web or mobile application libraries, allowing developers to focus on implementation of the process.

## Getting Started

1) Implementing base flow

```typescript
import {
  BaseTask,
  Executor,
  ExecutorImpl,
  ExecutorRepository,
  Process,
  ProcessImpl,
  ProcessInstance,
  ProcessInstanceImpl,
  Result,
  Task} from '@raincatcher/wfm';

// Create set of tasks you want to store
class MyTask extends BaseTask {
  public run() {
    // tslint:disable-next-line:no-console
    console.log('Executed task');
  }
}

// Create example process
const exampleProcess: Process = new ProcessImpl('Example');
exampleProcess.tasks = [];

// Store process instances.
const repository: ExecutorRepository = {
  saveInstance(instance: ProcessInstance): Promise<ProcessInstance> {
    // Save data here
    return Promise.resolve(instance);
  }
};

const executor: Executor = new ExecutorImpl(exampleProcess, repository);
executor.start();

```

## Supported events

TODO
