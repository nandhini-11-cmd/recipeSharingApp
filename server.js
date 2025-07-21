const express = require('express');

const app = express();

const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
connectDB();

const cors = require('cors');

const userRoutes = require('./routes/userRoutes');

const recipeRoutes = require("./routes/recipeRoutes");

const mealPlanRoutes = require("./routes/mealPlanRoutes");



app.use(cors({
  origin: "*",
  credentials: true,
}));

app.use(express.json());

app.get("/", (req,res)=> {
    res.send("Recipe Sharing API is running!");
});

app.use("/api/users", userRoutes);

app.use("/api/recipes", recipeRoutes);

app.use("/api/mealplans", mealPlanRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(` Server running on port ${PORT} `));



