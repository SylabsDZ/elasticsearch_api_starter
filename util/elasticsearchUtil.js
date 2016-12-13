const _ = require('lodash');
const uuid = require('uuid');
const config = require('../config');
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: config.ELASTIC_SEARCH_HOST,
    log: 'trace'
});

exports.insert = function(req, res, next, params){
  var index = params.index || req.body.index;
  if (!index) { return res.status(400).json({error: "index is required"}); };
  var type = params.type || req.body.type;
  if (!type) { return res.status(400).json({error: "type is required"}); };
  var item = params.item || req.body.item;
  if(!item) { return res.status(400).json({error: "item is required"}); };
  var id = params.id || req.body.id || uuid.v4();

  client.create({
      index: index,
      type: type,
      id: id,
      body: JSON.stringify(item)
  }, function (error, response) {
    if (error) {
      return res.status(422).json({error: error.message});
    }
    return res.json({ id: response._id });
  });

}


exports.list = function (req, res, next, params){
    var index = params.index || req.body.index;
    if (!index) { return res.status(400).json({error: "index is required"}); };
    var type = params.type || req.body.type;
    if (!type) { return res.status(400).json({error: "type is required"}); };
    var skip = params.skip || req.body.skip;
    var limit = params.limit || req.body.limit;
    var q = params.q || req.body.q;
    client.search({
        index: index,
        type: type,
        body: {
            query: q,
            from: skip,
            size: limit
        }
    }).then(function (response) {
        var hits = _.map(response.hits.hits, (item) => {
          return {
            id: item['_id'],
            item: item['_source'],
            _score: item['_score']
          }
        });
        res.header("Access-Control-Allow-Origin", "*");
        res.setHeader('Content-Type', 'application/json');
        return res.json({total: response.hits.total, items: hits });
    }, function (err) {
        return res.status(422).json({err: JSON.parse(err)});
    });
}
