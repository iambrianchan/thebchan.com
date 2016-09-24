var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlogSchema = Schema({
	title: String,
	intro: String,
	body: String,
	images: Array,
	url: String,
	date: Date
});

module.exports = mongoose.model('Blog', BlogSchema);