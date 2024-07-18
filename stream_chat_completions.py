from openai import OpenAI

client = OpenAI()
messages = []

def chat_completion(user_input):
    global messages
    messages.append({"role": "user", "content": user_input})

    stream = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        stream=True,
    )

    assistant_response = ""
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            content = chunk.choices[0].delta.content
            assistant_response += content
            print(content, end="", flush=True)

    messages.append({"role": "assistant", "content": assistant_response})
    print("\n")

def main():
    print("Start chatting (type 'exit' to end the conversation):")
    while True:
        user_input = input("You: ")
        if user_input.lower() == 'exit':
            break
        chat_completion(user_input)

if __name__ == "__main__":
    main()