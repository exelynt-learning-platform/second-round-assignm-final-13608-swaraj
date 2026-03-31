# 🤖 Chatbox Application with AI Integration (Redux)

## 📌 Project Overview

This project is a **Chatbox Application** built using **React.js and Redux**, integrated with an AI API (OpenAI / Gemini / Claude / DeepSeek).

It allows users to send messages and receive real-time responses from an AI chatbot while managing application state efficiently using Redux.

---

## 🚀 Features

### 💬 User Interaction

* Users can type and send messages
* Real-time AI responses
* Chat history maintained during the session

### 🧠 State Management (Redux)

* Messages stored in Redux store
* Loading state while API is processing
* Error handling for failed API calls
* Async API handling using **redux-thunk**

### 🔌 API Integration

* Integrated with AI API (OpenAI / Gemini)
* Sends user input and receives responses
* Handles API authentication securely using environment variables

### 🎨 UI/UX

* Clean and modern chat interface
* User messages aligned to **left**
* AI responses aligned to **right**
* Typing/loading animation
* Error message display
* Fully responsive (Mobile + Desktop)

### ⚡ Performance

* Smooth chat experience
* Auto-scroll to latest message
* Efficient rendering of chat messages

---

## 🛠️ Tech Stack

* **Frontend:** React.js
* **State Management:** Redux Toolkit + redux-thunk
* **Styling:** Tailwind CSS
* **API:** OpenAI / Gemini API
* **HTTP Client:** Axios

---

## 📂 Project Structure

```
src/
│── components/
│   ├── Chat.js
│   ├── MessageList.js
│   ├── MessageInput.js
│
│── features/
│   └── chat/
│       ├── chatSlice.js
│
│── pages/
│   └── Home.js
│
│── services/
│   └── api.js
│
│── App.js
│── index.js
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_API_KEY=your_api_key_here
```

⚠️ Do not commit `.env` file to GitHub

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/chatbox-app.git
cd chatbox-app
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Start the development server

```
npm start
```

App will run at:

```
http://localhost:3000
```

---

## 🔄 API Request Format

Example request sent to AI API:

```
{
  "model": "gpt-3.5-turbo",
  "messages": [
    { "role": "user", "content": "Hello AI!" }
  ]
}
```

---

## ⚠️ Error Handling

* Displays error messages for:

  * Invalid API key
  * Network issues
  * API failures

---

## 🧪 Testing (Optional)

* Unit tests can be written using:

  * Jest
  * React Testing Library

---

## 📊 Evaluation Criteria Covered

✅ Redux state management
✅ API integration
✅ Responsive UI
✅ Loading & error handling
✅ Performance optimization
⚠️ Testing (optional)

---

## 👨‍💻 Author

* Name: Swarajya Bhumare
* Project: Chatbox AI Application

---

## 📜 License

This project is for educational purposes.
