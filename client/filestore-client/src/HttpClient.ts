export interface HttpClient {
  upload: (url: string, data: Formdata) => Promise<Response>;
  download: (url: string) => Promise<Response>;
}
