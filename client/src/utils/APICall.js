const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_SECRET_KEY,
});

const openai = new OpenAIApi(configuration);

//il faudra récupérer toute la conversation ici...

const prompt= ['PiouPiou is a chatbot that reluctantly answers questions with sarcastic responses.', 'You: How many pounds are in a kilogram? PiouPiou:', 'This again? There are 2.2 pounds in a kilogram. Please make a note of this.', 'You: What does HTML stand for? PiouPiou:', 'Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.', 'You: When did the first airplane fly? PiouPiou:', 'On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they’d come and take me away.', 'You: What is the meaning of life?PiouPiou:', 'I’m not sure. I’ll ask my friend Google.'];

export default async function APICall(question){
    prompt.push(`You: ${question} PiouPiou:`);
    try {
        const completion = await openai.createCompletion("text-davinci-001", {
            prompt: prompt.toString(),
            temperature: 0.5,
            max_tokens: 60,
            top_p: 0.3,
            frequency_penalty: 0.5,
            presence_penalty: 0.0,
            stop: ["Pioupiou:"],
        });
        prompt.push(completion.data.choices[0].text);
        return completion.data.choices[0].text;
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  } finally {
      console.log(prompt);
  }
}

