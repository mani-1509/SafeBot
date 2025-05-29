# SafeBot

SafeBot is a web-based assistant for reporting hazards, getting emergency alerts, and sharing safety tips. Built with Flask, OpenAI/Nebius API, and a modern chat UI, it helps users stay safe at home, online, and on the go.

## Features

- **Conversational Chatbot**: Ask questions or report hazards and get instant, AI-powered responses.
- **Emergency Tips**: Click the "Emergency Tips" button for quick, actionable safety advice in Markdown-styled cards.
- **Chat History**: Sidebar shows your previous conversations for easy reference.
- **Admin Reports**: View all hazard reports (admin route).
- **Markdown Support**: Bot replies (including tips) are rendered with Markdown for a clean, readable UI.
- **Reasoning Reveal**: Click "🤔 Show SafeBot's reasoning" to see the AI's internal thought process, styled for clarity.

## Screenshots

![SafeBot Chat UI](screenshot.png)

## Quick Start

1. **Clone the repo**

   ```sh
   git clone https://github.com/yourusername/SafeBot.git
   cd SafeBot
   ```

2. **Create a virtual environment**

   ```sh
   python -m venv .venv
   .venv\Scripts\activate
   ```

3. **Install dependencies**

   ```sh
   pip install -r requirements.txt
   ```

4. **Set up environment variables**

   Create a `.env` file in the project root:

   ```
   NEBIUS_API_KEY=your-nebius-api-key
   FLASK_ENV=development
   ```

5. **Run the app**

   ```sh
   python app.py
   ```

6. **Open in your browser**

   Go to [http://localhost:5000](http://localhost:5000)

## Project Structure

```
SafeBot/
│
├── app.py
├── requirements.txt
├── .env
├── static/
│   ├── css/
│   │   └── index.css
│   └── js/
│       └── index.js
├── templates/
│   ├── index.html
│   └── emergency_tips.html
└── README.md
```

## Customization

- **Safety Tips**: Edit `app.py` or the Markdown in `/emergency-tips` route.
- **Styling**: Tweak `static/css/index.css` for your brand.
- **Models**: Change the OpenAI/Nebius model in `app.py` as needed.

## License

MIT

---

_Stay safe, stay informed, and let SafeBot help you in any emergency!_
