const {PrismaClient} = require("@prisma/client");

const client = new PrismaClient();

async function main() {
	const todos = await client.todo.findMany();
	// const todos = await client.todo.create({data: {name: "野球"}});
	debugger;
}
main();

