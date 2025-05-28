
# Vite + React + Tailwind CSS v4 + Make.com + Optional Sanity Integration

## 🧰 Template Overview

This template sets up a basic landing page with:
- Tailwind CSS v4 styling
- A contact form (logs to console, optional Make.com integration)
- Optional dynamic homepage content powered by Sanity

---

## 1. Create Your Vite + React Project

```bash
npm create vite@latest my-site -- --template react
cd my-site
npm install
```

---

## 2. Install Tailwind CSS and Vite Plugin

```bash
npm install tailwindcss @tailwindcss/vite
```

---

## 3. Configure Vite to Use Tailwind

**Edit `vite.config.js`:**

```js
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
});
```

---

## 4. Add Tailwind to Your CSS

**Edit `src/index.css`:**

```css
@import "tailwindcss";
```

Ensure it's imported in `src/main.jsx`:

```js
import './index.css';
```

---

## 5. Set Up Routing and Pages

**main.jsx:**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import Contact from './pages/Contact';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
```

**pages/Home.jsx:**

```jsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold">Welcome to My Site</h1>
      <p className="mt-4">Helping you get started quickly.</p>
      <Link to="/contact">
        <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded">
          Contact Us
        </button>
      </Link>
    </div>
  );
}
```

**pages/Contact.jsx:**

```jsx
import { useForm } from "react-hook-form";

export default function Contact() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    console.log("Form submitted:", data);

    // Uncomment to use Make.com:
    // await fetch("https://hook.make.com/YOUR-WEBHOOK-ID", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data)
    // });

    reset();
    alert("Message sent!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <input {...register("name", { required: true })} placeholder="Name" className="w-full border p-2 mb-4" />
      <input {...register("email", { required: true })} placeholder="Email" className="w-full border p-2 mb-4" />
      <textarea {...register("message", { required: true })} placeholder="Message" className="w-full border p-2 mb-4" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
    </form>
  );
}
```

---

## 6. Initialize Sanity Studio (Optional)

```bash
npm install -g sanity
sanity init
```

Choose the "Clean project" template and dataset: `production`

---

## 7. Add Homepage Schema

1. Create `sanity/schemaTypes/homepage.js`:

```js
import { defineField, defineType } from 'sanity';

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'subtitle', type: 'string' }),
    defineField({ name: 'ctaText', type: 'string' }),
    defineField({ name: 'ctaLink', type: 'string' }),
    defineField({ name: 'image', type: 'image' }),
  ]
});
```

2. Edit `sanity/schemaTypes/index.js`:

```js
import { homepage } from './homepage';
export const schemaTypes = [homepage];
```

3. Run the studio:

```bash
sanity dev
```

---

## 8. Connect Sanity to Frontend and Configure CORS

1. Create `src/sanityClient.js`:

```js
import sanityClient from '@sanity/client';

export const client = sanityClient({
  projectId: 'your_project_id_here',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-01-01'
});
```

2. Find your Project ID:
   - In `sanity.config.js`
   - Or at [https://www.sanity.io/manage](https://www.sanity.io/manage)

3. Configure CORS:
   - Visit [https://www.sanity.io/manage](https://www.sanity.io/manage)
   - Go to API settings → CORS Origins
   - Add: `http://localhost:5173`
   - Leave “Allow credentials” unchecked and Save

---

## 9. Update Homepage to Use Sanity

Replace `Home.jsx` with:

```jsx
import React, { useEffect, useState } from 'react';
import { client } from '../sanityClient';
import { Link } from 'react-router-dom';

export default function Home() {
  const [content, setContent] = useState({});

  useEffect(() => {
    client.fetch(`*[_type == "homepage"][0]`).then(setContent);
  }, []);

  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold">{content.title || "Loading..."}</h1>
      <p className="mt-4">{content.subtitle}</p>
      <Link to={content.ctaLink || "/contact"}>
        <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded">
          {content.ctaText || "Contact Us"}
        </button>
      </Link>
    </div>
  );
}
```

---

✅ Your project is now fully functional with:
- Vite + Tailwind CSS v4 + React
- A contact form ready for Make.com
- Optional Sanity integration for dynamic content
