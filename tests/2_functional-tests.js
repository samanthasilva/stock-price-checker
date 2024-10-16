const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    suite('GET /api/stock-prices/', function() {
        test('1 stock', function(done) {
            chai.request(server)
            .get('/api/stock-prices')
            .query({stock: 'tsla'})
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.stockData.stock, 'TSLA');
                assert.property(res.body.stockData, 'price');
                assert.property(res.body.stockData, 'likes');
                done();
                console.log(res.body.stockData);
            });
        });
        test('1 stock with like', function(done) {
            chai.request(server)
            .get('/api/stock-prices')
            .query({stock: 'nvda', like: true})
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.stockData.stock, 'NVDA');
                assert.property(res.body.stockData, 'price');
                assert.property(res.body.stockData, 'likes');
                assert.equal(res.body.stockData.likes, 1);
                done();
            });
        });
        test('1 stock with like again (ensure likes arent double counted)', function(done) {
            chai.request(server)
            .get('/api/stock-prices')
            .query({stock: 'goog', like: true})
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.stockData.stock, 'GOOG');
                assert.property(res.body.stockData, 'price');
                assert.property(res.body.stockData, 'likes');
                assert.equal(res.body.stockData.likes, 1);
                done();
            });
        });
        test('2 stocks', function(done) {
            chai.request(server)
            .get('/api/stock-prices')
            .query({stock: ['tsla', 'nvda']})
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.property(res.body.stockData[0], 'price');
                assert.property(res.body.stockData[0], 'rel_likes');
                done();
            });
        });
        test('2 stocks and liking them', function(done){
            chai.request(server)
            .get('/api/stock-prices')
            .query({stock: ['tsla','nvda'], like: true})
            .end(function(err, res){
              assert.equal(res.status, 200);
              //assert.equal(res.body.stockData.likes, 1);
              assert.property(res.body.stockData[0], 'price');
              assert.property(res.body.stockData[0], 'rel_likes');
              done();
            })
        })        
    });
});
