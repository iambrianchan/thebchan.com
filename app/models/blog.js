var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlogSchema = Schema({

	title: String,
	intro: String,
	content: Array,
	url: String,
	date: Date

});

module.exports = mongoose.model('Blog', BlogSchema);