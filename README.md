# Social App

A modern, full-featured social media platform built with **React 19**, **Vite**, and **HeroUI**. Users can create posts, interact through comments, manage their profiles, and enjoy a sleek, responsive design with built-in dark mode.

---

### Features

- **Authentication**  
  Secure JWT-based login, registration, and protected routes.

- **Profile Management**  
  Update profile picture, change password, and view user details.

- **Post System**  
  Create, edit, and delete posts with support for image uploads.

- **Comments**  
  Engage with others through comment threads — add, edit, or delete.

- **Infinite Scroll**  
  Seamlessly load more posts as users scroll down.

- **Dark Mode**  
  Toggle between light and dark themes effortlessly.

- **Responsive UI**  
  Fully optimized for both desktop and mobile devices.

- **Form Validation**  
  Built-in validation using **Zod** and **react-hook-form**.

- **Toast Notifications**  
  Instant feedback on actions and errors with **React Toastify**.

- **Custom UI Components**  
  Built using [HeroUI](https://heroui.dev/) and Tailwind CSS.

---

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, HeroUI  
- **API Handling:** Axios, React Query  
- **Forms & Validation:** React Hook Form, Zod  
- **UX Enhancements:** Framer Motion, Moment.js, React Toastify  
- **Icons:** React Icons  

---

## Project Structure

social-app/
├── public/
├── src/
│ ├── assets/
│ ├── components/
│ ├── context/
│ ├── hooks/
│ ├── pages/
│ ├── utils/
│ ├── App.jsx
│ ├── main.jsx
│ ├── index.css
│ └── hero.js
├── .env.development
├── package.json
├── vite.config.js

---

## Getting Started

### 1. Clone the repository

git clone https://github.com/your-username/social-app.git
cd social-app

### 2. Install dependencies

npm install

### 3. Configure environment variables

Update .env.development with your API base URL:

VITE_API_URL=https://your-api-url.com

### 4. Run the development server

npm run dev

### Available Scripts

- npm run dev – Start the development server
- npm run build – Build the app for production
- npm run preview – Preview the production build
- npm run lint – Run ESLint to check for code issues

### Customization

UI Theme:
Modify src/index.css and src/hero.js for color schemes and global styles.

Component Templates:
Reusable components are located in src/components/. You can extend or override styles using CSS Modules or Tailwind.

### License

This project is licensed under the MIT License.
