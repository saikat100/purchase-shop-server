const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors());
app.use(express.json())
const ObjectID = require('mongodb').ObjectID;

require('dotenv').config();
	app.get("/", (req, res) => {
		res.send("Hi I am saikat hossain!");
	});

const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("bson");
const { ChangeStream } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.USER_PASSWORD}@cluster0.8ibkg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
});
client.connect((err) => {
	const productCollection = client
		.db(process.env.DB_NAME)
		.collection(process.env.COLLECTION_ONE);
	const checkoutCollection = client
		.db(process.env.DB_NAME)
		.collection(process.env.COLLECTION_TWO);

	app.get("/products", (req, res) => {
		productCollection.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});

	app.get("/product/:id", (req, res) => {
		const { id } = req.params;

		productCollection.find({ _id: ObjectID(id) }).toArray((err, documents) => {
			res.send(documents[0]);
		});
	});

	app.post("/addOrder", (req, res) => {
		const order = req.body;
		checkoutCollection.insertOne(order, (err, result) => {
			res.send({ count: result.insertedCount });
		});
	});

	app.get("/ordered", (req, res) => {
		checkoutCollection.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});

	app.post("/orderByEmail", (req, res) => {
		const { email } = req.body;
		checkoutCollection.find({ email: email }).toArray((err, documents) => {
			res.send(documents);
		});
	});

	app.post("/addProduct", (req, res) => {
		const product = req.body;
		productCollection.insertOne(product, (err, result) => {
			res.send({ count: result.insertedCount });
		});
	});

	app.delete("/orderDelete/:id", (req, res) => {
		const id = req.params.id;
		checkoutCollection.deleteOne({ _id: ObjectID(id) }).then((result) => {
			res.send({ count: result.deletedCount });
		});
	});
});

app.listen(process.env.Prot || 5000);