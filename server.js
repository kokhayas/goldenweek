const express = require("express");
const fs = require("fs");
const app = express();
const ejs = require("ejs");
const { PrismaClient } = require("@prisma/client");
// const { debug } = require("console");

const client = new PrismaClient();

app.use(express.urlencoded({ extended: true }));
// app.use(express.static("static"));

app.get("/", async (request, response) => {
	const template = fs.readFileSync("template.ejs").toString();

	const datas = await client.bulletin.findMany();
	console.log(datas);
	const html = ejs.render(template, {datas: datas})
	response.send(html);
})

app.post("/send", async (request, response) => {
	// const data = {name: request.body.name, message: request.body.message};
	// console.log(data);
	// await client.bulletin.create({data: data});
	// const datas = await client.bulletin.findMany();
	// console.log(datas);

	if (request.query.edit === "true") {
		await client.bulletin.update({
			where: {
				id: Number(request.query.id),
			},
			data: {
				name: request.body.name,
				message: request.body.message
			},
		})
		// lists[Number(request.query.index)] = {name: request.body.name, message: request.body.message}
	}
	else {
		await client.bulletin.create({data: {name: request.body.name, message: request.body.message}})
	}
	const datas = await client.bulletin.findMany();
	const template = fs.readFileSync("template.ejs").toString();
	const html = ejs.render(template, {datas: datas})
	response.send(html);
});

app.get("/edit", async (request, response) => {
	// const datas = await client.bulletin.findMany();
	console.log(request.query.id);
	const data = await client.bulletin.findUnique({
		where: {
			id: Number(request.query.id),
		},
		// select: {
		// 	id: true,
		// 	name: true,
		// 	message: true,
		// },
		})
	const template = fs.readFileSync("edit.ejs").toString();
	const html = ejs.render(template, {data: data})
	response.send(html);
})

app.get("/reset", async (request, response) => {
	await client.bulletin.deleteMany();
	const datas = await client.bulletin.findMany();
	const template = fs.readFileSync("template.ejs").toString();
	const html = ejs.render(template, {datas: datas})
	response.send(html);
})

app.listen(process.env.PORT || 3000);