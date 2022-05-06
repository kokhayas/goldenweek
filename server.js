const express = require("express");
const fs = require("fs");
const app = express();
const ejs = require("ejs");
const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

app.use(express.urlencoded({ extended: true }));

app.get("/", async (request, response) => {
	const template = fs.readFileSync("template.ejs").toString();

	const datas = await client.bulletin.findMany();
	console.log(datas);
	const html = ejs.render(template, {datas: datas})
	response.send(html);
})

app.post("/send", async (request, response) => {
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
	console.log(request.query.id);
	const data = await client.bulletin.findUnique({
		where: {
			id: Number(request.query.id),
		},
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