const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("review server is running now ");
});
app.listen(port, () => {
	console.log("port is running", port);
});
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.jf2skzr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

async function run() {
	const recipesCollection = client
		.db("ReviewRecipesCollection")
		.collection("recipes");

	app.get("/limitRecipes", async (req, res) => {
		const cursor = recipesCollection.find({});
		const limitRecipes = await cursor.limit(3).toArray();
		res.send(limitRecipes);
	});
	app.get("/recipes", async (req, res) => {
		const cursor = recipesCollection.find({});
		const recipes = await cursor.toArray();
		res.send(recipes);
	});
	app.get("/recipes/:id", async (req, res) => {
		const { id } = req.params;
		const query = { _id: ObjectId(id) };
		const recipes = await recipesCollection.findOne(query);
		res.send(recipes);
	});
}
run().catch(err => {
	console.log(err);
});
