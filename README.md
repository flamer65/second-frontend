# 🧠 Second Brain

A modern web application to save and organize your favorite Twitter posts and YouTube videos in one place. Build your personal knowledge base and share it with others.

![Second Brain](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-blue)

## ✨ Features

- **🔐 Authentication** - Secure sign up and sign in with JWT tokens
- **📺 YouTube Embed** - Save YouTube videos with embedded player
- **🐦 Twitter Embed** - Save Twitter/X posts with full embed support
- **🏷️ Tags** - Organize content with custom tags
- **🔗 Share Brain** - Generate shareable links to your collection
- **📱 Responsive Design** - Works on desktop, tablet, and mobile
- **🎨 Modern UI** - Beautiful purple-themed design with smooth animations

## 🖼️ Screenshots

### Sign In Page

The sign in page features a clean, modern design with the Second Brain logo and form.

### Dashboard

View all your saved content in a responsive grid layout with embedded YouTube videos and Twitter posts.

### Add Content Modal

Easily add new content by pasting a URL, selecting the type, and adding tags.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend server running (second-brain backend)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd week-16-brainly-fe-main
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open http://localhost:5174 in your browser

### Backend Setup

Make sure your backend server is running on `http://localhost:3001` with the following endpoints:

| Method | Endpoint                   | Description            |
| ------ | -------------------------- | ---------------------- |
| POST   | `/api/v1/signup`           | Create new user        |
| POST   | `/api/v1/signin`           | Sign in user           |
| GET    | `/api/v1/content`          | Get all content        |
| POST   | `/api/v1/content`          | Create new content     |
| DELETE | `/api/v1/content/:id`      | Delete content         |
| GET    | `/api/v1/tags`             | Get all tags           |
| POST   | `/api/v1/brain/share`      | Enable/disable sharing |
| GET    | `/api/v1/brain/:shareLink` | Get shared content     |

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Embeds**: Twitter widgets.js, YouTube iframe

## 📁 Project Structure

```
src/
├── api.ts                 # API service layer
├── App.tsx                # Main app with routing
├── main.tsx               # Entry point
├── components/
│   └── ui/
│       ├── Button.tsx     # Reusable button component
│       ├── Card.tsx       # Content card with embeds
│       ├── AddContentModal.tsx  # Modal for adding content
│       └── Sidebar.tsx    # Navigation sidebar
├── icons/
│   ├── PlusIcon.tsx
│   ├── ShareIcon.tsx
│   ├── TwitterIcon.tsx
│   ├── YouTubeIcon.tsx
│   ├── DeleteIcon.tsx
│   └── LinkIcon.tsx
└── pages/
    ├── SignIn.tsx         # Sign in page
    └── SignUp.tsx         # Sign up page
```

## 🎨 Design Features

- **Purple Theme** - Consistent purple color palette (#5046e4, #7c3aed)
- **Glassmorphism** - Backdrop blur effects on header
- **Smooth Animations** - Fade in, slide up animations
- **Hover Effects** - Card lift effect, button transitions
- **Responsive Grid** - 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)

## 📝 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Made with ❤️ using React and TypeScript
