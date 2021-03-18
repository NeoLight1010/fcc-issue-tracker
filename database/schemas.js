const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema({
    issue_title: String,
    issue_text: String,
    created_by: String,
    assigned_to: String,
    status_text: String,
    open: Boolean,
    created_on: Date,
    updated_on: Date
});

exports.IssueSchema = IssueSchema;