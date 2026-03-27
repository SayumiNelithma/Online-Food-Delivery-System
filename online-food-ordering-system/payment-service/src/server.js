require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5010;

connectDB();

app.listen(PORT, () => {
	console.log(`Payment service running on port ${PORT}`);
});
