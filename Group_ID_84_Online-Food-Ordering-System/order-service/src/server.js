require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5004;

connectDB();

app.listen(PORT, () => {
	console.log(`Order service running on port ${PORT}`);
});
