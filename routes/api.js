'use strict';
const db_utils = require('../database/utils');

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
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
        db_utils.createIssue(
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
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
