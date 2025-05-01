require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');

const allowedOrigins = ['cs-sbd9-front.vercel.app'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
app.use(cors(corsOptions));

app.use('/user', require('./src/routes/userRoutes'));
app.use('/store', require('./src/routes/storeRoutes'));
app.use("/item", require('./src/routes/itemRoutes'));
app.use("/transaction", require('./src/routes/transactionRoutes'));


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
