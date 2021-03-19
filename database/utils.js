const { Issue } = require('./models');

function deleteAllIssues(done) {
  Issue.deleteMany({}, (err, data) => {
    if (err) return console.log(err);
    done(null, data);
  });
}

function createIssue(done, title, text, createdBy, assignedTo="", statusText="") {
  const issueData = {
    issue_title: title,
    issue_text: text,
    created_by: createdBy,
    assigned_to: assignedTo,
    status_text: statusText,
    open: true,
    created_on: Date.now(),
    updated_on: Date.now()
  } 

  const newIssue = new Issue(issueData);

  newIssue.save((err, data) => {
    if (err) return console.log(err);
    done(null, data);
  });
}

function getIssues(done, filters) {
  Issue.find(filters, (err, docs) => {
    if (err) return console.log(err);

    done(null, docs);
  });
}

function updateIssueById(done, id, updates) {
  updates.updated_on = Date.now();

  Issue.findByIdAndUpdate(id, updates, {"useFindAndModify": false}, (err, data) => {
    if (err || data === null) return done(err, null);
    else done(null, data);
  })
}

exports.deleteAllIssues = deleteAllIssues;
exports.createIssue = createIssue;
exports.getIssues = getIssues;
exports.updateIssueById = updateIssueById;
