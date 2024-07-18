const OpenAI = require("openai");
const readline = require("readline");

const openai = new OpenAI();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let messages = [];

async function chatCompletion(userInput) {
  messages.push({ role: "user", content: userInput });

  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages,
    stream: true,
  });

  let assistantResponse = "";

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    assistantResponse += content;
    process.stdout.write(content);
  }

  messages.push({ role: "assistant", content: assistantResponse });

  console.log("\n");
  askQuestion();
}

function askQuestion() {
  rl.question("You: ", (userInput) => {
    if (userInput.toLowerCase() === "exit") {
      rl.close();
      return;
    }
    chatCompletion(userInput);
  });
}

console.log("Start chatting (type 'exit' to end the conversation):");
askQuestion();
