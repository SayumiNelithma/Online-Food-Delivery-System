require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5005;

connectDB();

app.listen(PORT, () => {
	console.log(`Order service running on port ${PORT}`);
});
