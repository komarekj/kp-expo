import 'dotenv/config';

import { signupUser } from './omnisend.js';

signupUser('tsh@pixelter.com', '1234567890')
  .then((response) => {
    console.log('Response:', response);
  })
  .catch((error) => {
    console.error('Error:', error);
  });