/// <reference path="../node_modules/@epehc/sharedutilities/types/express.d.ts" />


import express from "express";
import bodyParser from "body-parser";
import facturaRoutes from "./routes/facturaRoutes";
import pagoRoutes from "./routes/pagoRoutes";
import {setupSwagger} from "./utils/swagger";
import cors from "cors";

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL, // Your frontend's URL
    credentials: true, // Allow credentials (cookies, headers)
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
setupSwagger(app);
app.use('/facturas', facturaRoutes);
app.use('/pagos', pagoRoutes)

const PORT = 4004;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});