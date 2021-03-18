const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("Create Issue Tests", () => {
    test("Create issue with every field", async (done) => {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
          issue_title: "Chai test issue",
          issue_text: "This is a test",
          created_by: "admin",
          assigned_to: "not_admin",
          status_text: "testing",
        })
        .end((err, res) => {
          assert.equal(res.status, 200, "Res. Status");
          assert.equal(res.type, "application/json", "Res. Type");
          assert.equal(res.body.issue_title, "Chai test issue", "Issue Title");
          assert.equal(res.body.issue_text, "This is a test", "Issue Text");
          assert.equal(res.body.created_by, "admin", "Issue Created By");
          assert.equal(res.body.assigned_to, "not_admin", "Issue Assigned To");
          assert.equal(res.body.status_text, "testing", "Issue Status Text");
          done();
        });
    });

    test("Create issue with only required fields", async (done) => {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
          issue_title: "Chai test issue",
          issue_text: "This is a test",
          created_by: "admin",
        })
        .end((err, res) => {
          assert.equal(res.status, 200, "Res. Status");
          assert.equal(res.type, "application/json", "Res. Type");
          assert.equal(res.body.issue_title, "Chai test issue", "Issue Title");
          assert.equal(res.body.issue_text, "This is a test", "Issue Text");
          assert.equal(res.body.created_by, "admin", "Issue Created By");
          assert.equal(res.body.assigned_to, "", "Issue Assigned To");
          assert.equal(res.body.status_text, "", "Issue Status Text");
          done();
        });
    });

    test("Create issue with missing required fields", async (done) => {
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
});
