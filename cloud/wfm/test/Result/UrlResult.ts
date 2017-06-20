import UrlResult from '../../src/result/UrlResult';
import suite from './index';

const sampleUrl = 'https://github.com/feedhenry-raincatcher';
const invalidUrl = `And we don't care about the old folks`;
describe('UrlResult', function() {
  suite(() => new UrlResult(sampleUrl));

  it('should have UrlResult as its type');
  it('should parse the url into a nodejs urlObject');
  it('should not accept an invalid url');
});
