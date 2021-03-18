const { Issue } = require('./models');

function deleteAllIssues(done) {
  Issue.deleteMany({}, (err, data) => {
    if (err) return console.log(err);
    done(null, data);
  });
}

exports.deleteAllIssues = deleteAllIssues;