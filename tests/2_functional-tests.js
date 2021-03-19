const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const dbUtils = require("../database/utils");
const { Issue } = require("../database/models");

chai.use(chaiHttp);

let testIssue;

suite("Functional Tests", function () {
  suiteSetup((done) => {
   dbUtils.deleteAllIssues(done);     

   dbUtils.createIssue(
        (err, newIssue) => {testIssue = newIssue},
        "update test",
        "testing update with put request",
        "neo_admin",
        "assignee_1",
        "testing"
      );
  });

  suite("Create Issues Tests", () => {
    test("Create issue with every field",  (done) => {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
          issue_title: "Every field test issue",
          issue_text: "This is a test",
          created_by: "admin",
          assigned_to: "every_field_asignee",
          status_text: "testing",
        })
        .end((err, res) => {
          assert.equal(res.status, 200, "Res. Status");
          assert.equal(res.type, "application/json", "Res. Type");
          assert.equal(res.body.issue_title, "Every field test issue", "Issue Title");
          assert.equal(res.body.issue_text, "This is a test", "Issue Text");
          assert.equal(res.body.created_by, "admin", "Issue Created By");
          assert.equal(res.body.assigned_to, "every_field_asignee", "Issue Assigned To");
          assert.equal(res.body.status_text, "testing", "Issue Status Text");
          done();
        });
    });

    test("Create issue with only required fields",  (done) => {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
          issue_title: "Only required fields test issue",
          issue_text: "This is a test",
          created_by: "admin",
        })
        .end((err, res) => {
          assert.equal(res.status, 200, "Res. Status");
          assert.equal(res.type, "application/json", "Res. Type");
          assert.equal(res.body.issue_title, "Only required fields test issue", "Issue Title");
          assert.equal(res.body.issue_text, "This is a test", "Issue Text");
          assert.equal(res.body.created_by, "admin", "Issue Created By");
          assert.equal(res.body.assigned_to, "", "Issue Assigned To");
          assert.equal(res.body.status_text, "", "Issue Status Text");
          done();
        });
    });

    test("Create issue with missing required fields",  (done) => {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
          assigned_to: "not_admin",
          status_text: "testing",
        })
        .end((err, res) => {
          assert.equal(res.status, 200, "Res. Status");
          assert.equal(res.type, "application/json", "Res. Type");
          assert.equal(res.body.error, "required field(s) missing", "Error");
          done();
        });
    });
  });

  suite('View Issues Tests', () => {
    test("View all issues",  (done) => {
      chai
        .request(server)
        .get('/api/issues/apitest')
        .end((req, res) => {
          assert.equal(res.status, 200, 'Res. Status');
          assert.typeOf(res.body, 'array', 'res.body Type');
          assert.isOk(res.body[0].issue_title, "Issue Title");
          assert.isOk(res.body[0].issue_text, "Issue Text"); 
          assert.exists(res.body[0].assigned_to, "Assigned To");
          assert.exists(res.body[0].status_text, "Status Text");
          assert.isOk(res.body[0].open, "Open");
          assert.isOk(res.body[0]._id, "ID");
          assert.isOk(res.body[0].created_by, "Created By");
          assert.isOk(res.body[0].created_on, "Created On");
          assert.isOk(res.body[0].updated_on, "Updated On");
          done();
        });
    });

    test("View issues with one filter",  (done) => {
      chai
        .request(server)
        .get('/api/issues/apitest?assigned_to=every_field_asignee')
        .end((req, res) => {
          assert.equal(res.status, 200, "Res. Status");
          assert.equal(res.type, "application/json", "Res. Type");
          assert.typeOf(res.body, 'array');
          assert.equal(res.body[0].issue_title, "Every field test issue", "Issue Title");
          assert.equal(res.body[0].issue_text, "This is a test", "Issue Text");
          assert.equal(res.body[0].created_by, "admin", "Issue Created By");
          assert.equal(res.body[0].assigned_to, "every_field_asignee", "Issue Assigned To");
          assert.equal(res.body[0].status_text, "testing", "Issue Status Text");
          done(); 
        });
    })

    test("View issues with multiple filters",  (done) => {
      chai
        .request(server)
        .get('/api/issues/apitest?assigned_to=every_field_asignee&open=true')
        .end((req, res) => {
          assert.equal(res.status, 200, "Res. Status");
          assert.equal(res.type, "application/json", "Res. Type");
          assert.typeOf(res.body, 'array');
          assert.equal(res.body[0].issue_title, "Every field test issue", "Issue Title");
          assert.equal(res.body[0].issue_text, "This is a test", "Issue Text");
          assert.equal(res.body[0].created_by, "admin", "Issue Created By");
          assert.equal(res.body[0].assigned_to, "every_field_asignee", "Issue Assigned To");
          assert.equal(res.body[0].status_text, "testing", "Issue Status Text");
          done(); 
        });
    });
  });

  suite('Update Issues Tests', () => {
    test('Update one field', (done) => {
      const testIssueId = testIssue._id;

      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          "_id": testIssueId,
          "assigned_to": "assignee_2" 
        })
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, testIssueId);
          done();
        });
    });

    test('Update multiple fields', (done) => {
      const testIssueId = testIssue._id; 

      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          "_id": testIssueId,
          "assigned_to": "assignee_3",
          "issue_title": "testing changing title"
        })
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, testIssueId);
          done();
        });
    });

    test('Attempt update without _id', (done) => {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          "_id": "",
          "issue_title": "no _id update attempt"
        })
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });

    test('Attempt update without updated fields', (done) => {
      const testIssueId = testIssue._id;

      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          "_id": testIssueId
        })
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "no update field(s) sent");
          assert.equal(res.body._id, testIssueId);
          done();
        });
    });

    test('Attempt update with invalid/unknown id', (done) => {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          "_id": "5f665eb46e296f6b9b6a504d",
          "issue_title": "this should not work"
        })
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not update");
          done();
        });
    });
  });

  suite('Delete Issues Tests', () => { 
    test('Delete issue', (done) => {
      const id = testIssue._id;
      chai
        .request(server)
        .delete('/api/issues/apitest')
        .send({
          '_id': id
        })
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully deleted");
          assert.equal(res.body._id, id);

          Issue.findById(id, (err, data) => {
            assert.exists(data);
            assert.notExists(err);
          });
          done();
        });
    });

    test('Delete with invalid _id', (done) => {
      const id = '5f665eb46e296f6b9b6a504d';

      chai
        .request(server)
        .delete('/api/issues/apitest')
        .send({"_id": id})
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'could not delete');
          assert.equal(res.body._id, id);
          done();
        });
    });

    test('Delete missing _id', (done) => {
      chai
        .request(server)
        .delete('/api/issues/apitest')
        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });
  });
});
