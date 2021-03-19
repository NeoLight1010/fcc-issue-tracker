'use strict';
const { ObjectID } = require('bson');
const dbUtils = require('../database/utils');

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      const filters = req.query;

      dbUtils.getIssues((err, docs) => res.json(docs), filters)
    })
    
    .post(function (req, res){
      let project = req.params.project;
      
      const body = req.body;
      if (!body.issue_title ||
          !body.issue_text ||
          !body.created_by) {
            res.json({"error": "required field(s) missing"})
          }
      else {
        dbUtils.createIssue(
          (err, data) => {res.json(data)},
          body.issue_title,
          body.issue_text,
          body.created_by,
          body.assigned_to || '',
          body.status_text || ''
        );
      }
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
      const id = req.body._id;
      let updates = req.body; try {delete updates._id} catch(err) {};
      
      if (!id) {
        return res.json({"error": "missing _id"});
      }

      if (Object.keys(updates).length === 0) {
        return res.json({"error": "no update field(s) sent", "_id": id});
      }
      
      if (!ObjectID.isValid(id)) {
        return res.json({"error": "could not update", "_id": id});
      }
      
      dbUtils.updateIssueById((err, data) => {
        if (err || data === null) res.json({"error": "could not update", "_id": id});
        else {
          res.json({
            "result": "successfully updated",
            "_id": id
        });}
      }, id, updates);
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
