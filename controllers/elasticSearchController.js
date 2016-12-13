const elasticsearchUtil = require('../util/elasticsearchUtil');

exports.insert = function(req, res, next){
  var params = {};
  elasticsearchUtil.insert(req, res, next, params);
}

exports.list = function(req, res, next){
  var params = {};
  elasticsearchUtil.list(req, res, next, params);
}
