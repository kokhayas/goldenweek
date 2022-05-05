const express = require("express");
const fs = require("fs");
const app = express();
const ejs = require("ejs");

app.use(express.urlencoded({ extended: true }));
// app.use(express.static("static"));

let lists = [];

app.get("/", (request, response) => {
	lists.push({name: request.body.name, message: request.body.message});
	const template = fs.readFileSync("template.ejs").toString();
	const html = ejs.render(template, {lists: lists})
	response.send(html);
});


app.get("/rewrite", (request, response) => {
	const template = fs.readFileSync("template2.ejs").toString();
	// lists[request.query.index]
	const html = ejs.render(template, {lists: lists, index: request.query.index})
	response.send(html);
})

app.post("/send", (request, response) => {
	if (request.query.flag === "true") {
		lists[Number(request.query.index)] = {name: request.body.name, message: request.body.message}
	}
	else {
		lists.push({name: request.body.name, message: request.body.message});
	}

	const template = fs.readFileSync("template.ejs").toString();
	const html = ejs.render(template, {lists: lists})
	response.send(html);
});
app.listen(3003);