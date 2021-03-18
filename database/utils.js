const { Issue } = require('./models');

function deleteAllIssues(done) {
  Issue.deleteMany({}, (err, data) => {
    if (err) return console.log(err);
    done(null, data);
  });
}

function createIssue(done, title, text, createdBy, assignedTo="", statusText="") {
  const newIssue = new Issue({
    issue_title: title,
    issue_text: text,
    created_by: createdBy,
    assigned_to: assignedTo,
    status_text: statusText,
    open: true,
    created_on: Date.now(),
    updated_on: Date.now()
  });

  newIssue.save((err, data) => {
    if (err) return console.log(err);
    done(null, data);
  });
}

exports.deleteAllIssues = deleteAllIssues;
exports.createIssue = createIssue;