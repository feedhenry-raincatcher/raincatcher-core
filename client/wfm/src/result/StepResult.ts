export interface StepResult {
  submission?: {
    [key: string]: any
  };
  submitter?: string;
  timestamp: number;
  status: string;
  type?: string;
  step: {
    code: string,
    name: string,
    templates: {
      form: string,
      view: string
    }
  };
}
