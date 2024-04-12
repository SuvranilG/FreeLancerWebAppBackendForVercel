import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user-route.js";
import gigRoute from "./routes/gig-route.js";
import orderRoute from "./routes/order-route.js";
import conversationRoute from "./routes/conversation-route.js";
import messageRoute from "./routes/message-route.js";
import reviewRoute from "./routes/review-route.js";
import authRoute from "./routes/auth-route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

const PORT = process.env.PORT || 8800;

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB!");
  } catch (error) {
    console.log(error);
  }
};

// Define API endpoints
const apiEndpoints = [
  'https://freelancerwebapp.onrender.com',
  'https://backend-ogreenery.onrender.com',
  
];

function fetchData(apiUrl) {
  // Fetch data from the API
  fetch(apiUrl)
    .then(response => response.text())
    .then(data => {
      // Process the fetched data (e.g., update UI, store in state, etc.)
      console.log(`Fetched data from ${apiUrl}:`, data);
    })
    .catch(error => {
      console.error(`Error fetching data from ${apiUrl}:`, error);
    });
}

apiEndpoints.forEach(fetchData);


app.use(cors({
  origin: '*',
  // credentials: true,
  methods: ['GET', 'HEAD','POST','PUT','DELETE'],
  allowedHeaders:  ['Content-Type', 'Authorization','Origin']
}));




app.use(express.json());
app.use(cookieParser());
connect();

app.get("/", (req, res,next) => {
  res.send("Hello Freelancers");
  next();
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  
  return res.status(errorStatus).send(errorMessage);
});

app.listen(PORT, () => {
  console.log("Backend server is running!");
  const intervalInMilliseconds = 5 * 60 * 1000;
  setInterval(() => {
    apiEndpoints.forEach(fetchData);
  }, intervalInMilliseconds);
});
