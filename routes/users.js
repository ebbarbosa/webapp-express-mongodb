var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/userlist', function (req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  collection.find({}, {}, function (e, docs) {
    res.json(docs);
  });
});

router.post('/', function (req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  collection.insert(req.body, function (err, result) {
    res.send((err == null) ? { 'msg': '' } : { 'msg': err });
  });
});

router.delete('/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  var userId = req.params.id;
  collection.remove({ '_id': userId }, function (err) {
    res.send((err == null) ? { 'msg': '' } : { 'msg': err });
  });
});

router.put('/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  var userId = req.params.id;
  collection.update(req.body, function (err) {
    res.send((err == null) ? { 'msg': '' } : { 'msg': err });
  });
});

module.exports = router;