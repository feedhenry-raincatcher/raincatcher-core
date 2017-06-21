import * as assert from 'assert';
import UrlResult from '../../src/result/UrlResult';
import suite from './index';

const sampleUrl = 'https://github.com/feedhenry-raincatcher';
const invalidUrl = `http://<foo>`;
describe('UrlResult', function() {
  suite(() => new UrlResult(sampleUrl));
  let result: UrlResult;
  beforeEach(function() {
    result = new UrlResult(sampleUrl);
  });

  it('should have UrlResult as its type', function() {
    assert.equal(result.type, 'UrlResult');
  });
  it('should parse the url into a nodejs urlObject', function() {
    assert.equal(result.urlObject.host, 'github.com');
  });
  it('should not accept an invalid url', function() {
    assert.throws(() => new UrlResult(invalidUrl));
  });
});
