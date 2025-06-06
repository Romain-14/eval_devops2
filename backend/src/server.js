import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
