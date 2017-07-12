import { CloudPage } from './app.po';

describe('cloud App', () => {
  let page: CloudPage;

  beforeEach(() => {
    page = new CloudPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
