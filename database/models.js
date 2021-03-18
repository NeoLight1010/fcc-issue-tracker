const { IssueSchema } = require('./schemas');
const mongoose = require("mongoose");

const Issue = mongoose.model('Issue', IssueSchema);

exports.Issue = Issue;
