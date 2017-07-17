import { CreatePageWikitudeAppPage } from './app.po';

describe('create-page-wikitude-app App', () => {
  let page: CreatePageWikitudeAppPage;

  beforeEach(() => {
    page = new CreatePageWikitudeAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
