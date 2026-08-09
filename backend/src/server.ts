import app from './app';
import { env } from './config/env';

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(` AI STUDY PLANNER API SERVER STARTED`);
  console.log(` Running on: http://localhost:${PORT}`);
  console.log(` Environment: ${env.NODE_ENV}`);
  console.log(` Gemini API Key Configured: ${env.GEMINI_API_KEY ? 'YES' : 'NO (Fallback Active)'}`);
  console.log(`===================================================`);
});
