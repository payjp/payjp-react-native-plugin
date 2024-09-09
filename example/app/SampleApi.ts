import { Token } from 'payjp-react-native';

// TODO: REPLACE WITH YOUR ENDPOINT URL
// You can set up sample server api with following repo.
// https://github.com/payjp/example-tokenize-backend
// (If you deploy the sample server app to Heroku, the url will be like
// `https://[your_app_name].herokuapp.com/save_card`)
//
// See the link above for more details.
const SAMPLE_BACKEND_URL = '';

export const postTokenToBackEnd = async (token: Token): Promise<string> => {
    if (!SAMPLE_BACKEND_URL) {
        console.warn(`backendUrl is not replaced yet.
You can send token(${token.id}) to your own server to make Customer etc.`);
        return Promise.resolve('skip sending server');
    }
    const response = await fetch(SAMPLE_BACKEND_URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            card: token.id,
        }),
    });
    const json = await response.json();
    if (response.status >= 400) {
        throw Error(json.message);
    }
    return json;
};
