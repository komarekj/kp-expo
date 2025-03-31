
const sendRequest = async (path, params, method = 'POST') => {
  const reponse = await fetch(`https://api.omnisend.com/v5/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-API-KEY': process.env.OMNISEND_API_KEY,
    },
    body: JSON.stringify(params),
  });

  const data = await reponse.json();

  if (!reponse.ok) {
    console.error('Error sending request to Omnisend:', data);
    throw new Error(`Omnisend API error: ${JSON.stringify(data.message)}`);
  }

  return data;
};

export const signupUser = async (email, userId) => {
  const params = {
    sendWelcomeEmail: false,
    tags: ['expo-membership'],
    identifiers: [
      {
        type: 'email',
        id: email,
        channels: {
          email: {
            status: 'subscribed',
          }
        },
        consent: {
          createdAt: new Date().toISOString(),
          source: 'expo',
        },
      }
    ],
    customProperties: {
      'expo_id': userId,
      'expo_link': `https://expo.kohepets.com.sg/account?code=${userId}`,
    },
    source: 'expo',
  };

  const response = await sendRequest('contacts', params, 'POST');
  return response;
};
