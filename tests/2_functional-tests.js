const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const dbUtils = require("../database/utils");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suiteSetup((done) => {
   dbUtils.deleteAllIssues(done);     
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
});
