export interface ExampleWorkOrder {
  id: string,
  workflowId: string,
  assignee: string,
  type: string,
  title: string,
  status: string
  startTimestamp: Date,
  address: string,
  location: number[],
  summary, string
}

export interface ExampleWorkFlow {
  id: string,
  title: string,
  steps: ExampleStep[]
}

export interface ExampleStep {
  code: string;
  name: string;
  templates: ViewTemplates;
}

export interface ViewTemplates {
  form: string;
  view: string;
}
