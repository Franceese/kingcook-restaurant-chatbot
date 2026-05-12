# KingCook Restaurant ChatBot 🍲

A full-stack restaurant chatbot application that allows customers to place food orders using a chat interface.

## Features

- Chat-based ordering system
- Nigerian food menu
- Persistent sessions
- Current order tracking
- Order history
- Cancel order functionality
- Paystack payment integration
- Mobile responsive UI
- Glassmorphism modern design

---

# Tech Stack

## Frontend
- React
- Tailwind CSS
- Axios
- React Router DOM

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Payment
- Paystack

---

# Installation Guide

## Clone Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_LINK>
```

---

# Backend Setup

## Navigate to server folder

```bash
cd server
```

## Install dependencies

```bash
npm install
```

## Create .env file

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_CONNECTION_STRING

PAYSTACK_SECRET_KEY=YOUR_PAYSTACK_SECRET_KEY
```

## Start backend server

```bash
npm run dev
```

---

# Frontend Setup

## Navigate to client folder

```bash
cd client
```

## Install dependencies

```bash
npm install
```

## Start frontend

```bash
npm run dev
```

---

# Payment Testing

Use Paystack test card:

```text
4084084084084081
```

CVV:

```text
408
```

Expiry:

```text
12/30
```

OTP:

```text
123456
```

---

# ChatBot Commands

| Command | Function |
|---|---|
| 1 | Place order |
| 97 | Current order |
| 98 | Order history |
| 99 | Checkout |
| 0 | Cancel order |

---

# Author

Francees