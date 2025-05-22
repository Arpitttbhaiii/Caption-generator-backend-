import express from 'express';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/generate-caption', async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a creative caption generator.' },
        { role: 'user', content: `Generate a short, catchy caption for: ${topic}` },
      ],
      max_tokens: 50,
    });

    const caption = completion.data.choices[0].message.content.trim();
    res.json({ caption });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate caption' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
