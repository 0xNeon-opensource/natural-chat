import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import getStringFromStorage from './getStringFromStorage';


const helloGpt = async () => {
    const apiKey = await getStringFromStorage('apiKey');
    const configuration = new Configuration({
        apiKey
    });
    const openai = new OpenAIApi(configuration);

    try {

        const messages: ChatCompletionRequestMessage[] =
            [
                { "role": "system", "content": "You are a helpful assistant that translates English to French." },
                { "role": "user", "content": 'Translate the following English text to French: "{text}"' }
            ]
        const res = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { role: 'user', content: 'Hello!' }
            ],
            temperature: 0,
        })

        console.log('res :>> ', res);

    } catch (error) {
        console.log('error :>> ', error);
    }
}

export default helloGpt;