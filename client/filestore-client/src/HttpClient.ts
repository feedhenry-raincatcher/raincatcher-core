import * as Promise from 'bluebird';
export interface HttpClient {
  upload: (url: string, data: FormData) => Promise<Response>;
  download: (url: string) => Promise<Response>;
}
