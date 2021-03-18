const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema({
    issue_title: {type: String, required: true},
    issue_text: {type: String, required: true},
    created_by: {type: String, required: true},
    assigned_to: String,
    status_text: String,
    open: Boolean,
    created_on: Date,
    updated_on: Date,
});

exports.IssueSchema = IssueSchema;