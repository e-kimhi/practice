const express = require('express');
const OpenAI = require('openai');
require('dotenv').config();

const organization = process.env.ORGANIZATION || "";
const OpenApiKey = process.env.OPENAI_API_KEY || "";

const openai = new OpenAI({
//   organization: 'Personal',
    organization: organization,
  apiKey: OpenApiKey,
});

const app = express();
const port = process.env.PORT || 3001;

async function runCompletion () {
    try{
    const completion = await openai.chat.completions.create({
        // openai.chat.completions.create
    model: "gpt-3.5-turbo",
    prompt: "How are you today?",
    max_tokens:4000
    });
    console.log(completion.data.choices[0].message.content);
    return completion.data.choices[0].text;
}
catch(err){
    console.log(err.toString());
}

   
}

const ret = runCompletion();
console.log(ret);

app.get('/', (req, res) => {

    // const ret = runCompletion();
    const ret = 'none';
    if(ret !== null){
        res.send(ret);
    } else {
            res.send('Hello from the chatgpt test project!');
    }
  });


  app.listen(port, () => {
    console.log(`ChatGPT test listening on port ${port}`);
  });