# Modern Full-Stack Developer Portfolio

A responsive personal portfolio with a clean vanilla frontend (HTML5/CSS3/JavaScript) and a lightweight Node.js + Express backend with an integrated contact API, dynamic data storage, and dark/light mode.

---

## 🚀 Features

- **Dynamic Backend**: Express API serves portfolio content (`/api/portfolio`), handles contact submissions (`/api/contact`), and provides health metrics (`/api/health`).
- **Interactive Contact Form**: Sends live submissions straight to the backend with input validation.
- **Backend Inbox Drawer**: Built-in modal viewer to verify received messages in real time.
- **Dark & Light Mode**: Seamless theme switching with local storage persistence.
- **Filterable Showcase**: Filter projects by categories (Full Stack, Frontend, Backend).
- **Single-File Customization**: Update your name, skills, bio, and projects inside `data/portfolioData.json`.
- **Zero Complex Tooling**: No Webpack, Vite, or TypeScript build steps required. Runs directly with `npm start`.

---

## 📁 Project Structure

```text
Simple/
├── data/
│   ├── portfolioData.json   <-- Edit your details, skills, & projects here
│   └── messages.json        <-- Stored contact form submissions
├── public/
│   ├── index.html           <-- Semantic HTML5 structure
│   ├── style.css            <-- Modern styles, animations, & variables
│   └── app.js               <-- Client-side logic & API integration
├── .gitignore               <-- Prevents node_modules from pushing to Git
├── package.json             <-- Project metadata & dependencies
├── server.js                <-- Express server & API routes
├── render.yaml              <-- 1-click config for Render.com
├── vercel.json              <-- Serverless config for Vercel
└── README.md                <-- Documentation & setup guide
```

---

## 💻 Local Quickstart

### 1. Install dependencies
```bash
npm install
```

### 2. Start the server
```bash
npm start
```

### 3. Open in your browser
Visit: **[http://localhost:3000](http://localhost:3000)**

---

## 🐙 Push to GitHub using GitHub Desktop

1. Open **GitHub Desktop**.
2. Click **File** > **Add Local Repository** (or press `Ctrl + O`).
3. Browse and select this folder (`c:\Users\Asus\Pictures\Simple`).
4. GitHub Desktop will detect your initialized repository and list the files (`node_modules` is automatically ignored).
5. At the bottom left:
   - Summary: `Initial portfolio commit`
   - Click the blue **Commit to main** button.
6. Click **Publish repository** in the top bar.
7. Choose a repository name (e.g., `my-portfolio`), choose whether to keep it public or private, and click **Publish repository**.
8. Your portfolio code is now live on GitHub!

---

## 🌐 Free 1-Click Deployment

### Option A: Deploy to Render.com (Recommended for Full-Stack Node.js)
1. Sign up or log into [Render.com](https://render.com) using your GitHub account.
2. Click **New +** > **Web Service**.
3. Select your GitHub repository (`my-portfolio`).
4. Configure:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **Deploy Web Service**. Render will build and give you a free live `https://...onrender.com` URL.

### Option B: Deploy to Vercel
1. Log into [Vercel](https://vercel.com) with GitHub.
2. Click **Add New** > **Project** and import your portfolio repository.
3. Vercel automatically detects the `vercel.json` file.
4. Click **Deploy**. Your portfolio will be live in seconds.

---

## ✏️ How to Personalize

Open `data/portfolioData.json`:
- **`personal`**: Update your name, role, bio, location, email, and social profile links.
- **`stats`**: Change key numbers (years of experience, completed projects, etc.).
- **`skillCategories`**: Add or modify skills and percentage proficiencies.
- **`projects`**: Add your own project titles, descriptions, live demo links, and GitHub repositories.
- **`experience`**: Update your career or education timeline.
