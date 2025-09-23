const express = require("express");
const helmet = require("helmet");
const app = express();
const cors = require('cors')
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const errorMiddleware = require("./middlewares/errorHandler");
dotenv.config();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(cookieParser());


const routeRouter = require("./routes/routes");
const prefixUrl = process.env.PREFIX;
app.use(prefixUrl, routeRouter);        
// error handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

