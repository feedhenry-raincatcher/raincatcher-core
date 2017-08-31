import * as assert from 'assert';
import { userMapperMiddleware } from '../src/index';

describe('FeedHenry Sync Mapper Tests', function() {
  const res: any = {};
  const mapperField = 'field';
  const userId = 'serv33gsd';
  const datasetId = 'testDataset';
  describe('Test end user api', function() {
    it('create middleware with explicit flag', function(done) {
      const middleware = userMapperMiddleware(datasetId, mapperField, true);
      const req: any = {
        user: { id: userId },
        body: { dataset_id: datasetId, query_params: { otherField: 'value' } }
      };
      req.body.query_params[mapperField] = 7;
      middleware(req, res, function(err) {
        assert.ok(!err);
        assert.equal(req.body.query_params[mapperField], userId);
        assert.ok(!req.body.query_params.otherField);
        done();
      });
    });
    it('create middleware without explicit flag', function(done) {
      const middleware = userMapperMiddleware(datasetId, mapperField, false);
      const req: any = {
        user: { id: userId },
        body: { dataset_id: datasetId, query_params: { otherField: 'value' } }
      };
      req.body.query_params[mapperField] = 7;
      middleware(req, res, function(err) {
        assert.ok(!err);
        assert.equal(req.body.query_params[mapperField], userId);
        assert.ok(req.body.query_params.otherField);
        done();
      });
    });
    it('create middleware without user', function(done) {
      const middleware = userMapperMiddleware(datasetId, mapperField, false);
      const req: any = {
        body: { dataset_id: datasetId, query_params: { otherField: 'value' } }
      };
      req.body.query_params[mapperField] = 7;
      middleware(req, res, function(err) {
        assert.ok(err);
        assert.ok(req.body.query_params.otherField);
        done();
      });
    });
  });
});
