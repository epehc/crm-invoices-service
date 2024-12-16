import express from "express";
import bodyParser from "body-parser";
import facturaRoutes from "./routes/facturaRoutes";
import pagoRoutes from "./routes/pagoRoutes";


const app = express();
app.use(bodyParser.json());
app.use('/facturas', facturaRoutes);
app.use('/pagos', pagoRoutes)

const PORT = 4004;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});