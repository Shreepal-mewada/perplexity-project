
import app from './src/app.js';
import {generateResponse} from './src/services/ai.service.js';

generateResponse();
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});