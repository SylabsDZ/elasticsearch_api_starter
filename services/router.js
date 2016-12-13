const ElasticSearchController = require('../controllers/elasticSearchController');
var router = require('express').Router();

router.route('/insert')
  .post(ElasticSearchController.insert);

router.route('/list')
  .post(ElasticSearchController.list);

module.exports = router;
