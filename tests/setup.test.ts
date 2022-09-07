import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/server';

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('Test App running', () => {
  describe('GET health /', () => {
    it('GET health check success', (done) => {
      chai.request(app)
        .get('/api/v1/health')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('string');
          res.body.should.be.eq('Server is running')
          done();
        });
    }).timeout(5000);
  });
});
