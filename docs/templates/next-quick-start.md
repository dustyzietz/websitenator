
# 🚀 Hanalei App – Fullstack Setup with Mongoose, React Query, shadcn/ui, and TanStack Table

## 🧰 Tech Stack

- Next.js (App Router + TypeScript)
- Tailwind CSS v4
- React Hook Form
- Mongoose + MongoDB
- React Query (scoped to messages layout)
- shadcn/ui components
- TanStack Table logic for data grid

---

## ✅ Step 1: Create the Project

```bash
npx create-next-app@latest hanalei-next-app \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"
cd hanalei-next-app
```

## ✅ Step 2: Install Packages

```bash
npm install react-hook-form mongoose @tanstack/react-query @tanstack/react-table
```

## ✅ Step 3: Tailwind CSS Setup

Already configured by `create-next-app`.

---

## ✅ Step 4: Create Pages

### Home Page (`src/app/page.tsx`)

```tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold">Welcome to My Site</h1>
      <p className="mt-4">Helping you get started quickly.</p>
      <Link href="/contact">
        <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded">
          Contact Us
        </button>
      </Link>
    </div>
  );
}
```

### Contact Page (`src/app/contact/page.tsx`)

```tsx
'use client';

import { useForm } from 'react-hook-form';

export default function ContactPage() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("Message saved!");
      reset();
    } else {
      alert("Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <input {...register("name", { required: true })} placeholder="Name" className="w-full border p-2 mb-4" />
      <input {...register("email", { required: true })} placeholder="Email" className="w-full border p-2 mb-4" />
      <textarea {...register("message", { required: true })} placeholder="Message" className="w-full border p-2 mb-4" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
    </form>
  );
}
```

---

## ✅ Step 5: MongoDB + Mongoose Setup

### `.env.local`

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/hanalei?retryWrites=true&w=majority
```

### `src/models/Message.ts`

```ts
import mongoose, { Schema, models, model } from 'mongoose';

const messageSchema = new Schema({
  name: String,
  email: String,
  message: String,
}, { timestamps: true });

export const Message = models.Message || model('Message', messageSchema);
```

### `src/lib/mongoose.ts`

```ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) throw new Error('Missing MONGODB_URI');

let cached = (global as any).mongoose || (global as any).mongoose = { conn: null, promise: null };

export default async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

---

## ✅ Step 6: API Route

### `src/app/api/contact/route.ts`

```ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Message } from '@/models/Message';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();
    const savedMessage = await Message.create(body);
    return NextResponse.json({ success: true, id: savedMessage._id });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const messages = await Message.find().sort({ createdAt: -1 });
    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json({ messages: [] }, { status: 500 });
  }
}
```

---

## ✅ Step 7: React Query Scoped to `/messages`

### `src/app/messages/layout.tsx`

```tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

---

## ✅ Step 8: Set Up Data Table

### Install base table UI from shadcn:

```bash
npx shadcn@latest add table
```

---

### Create `src/components/ui/data-table.tsx`

```tsx
'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

---

### Create `src/components/ui/columns.ts`

```ts
import { ColumnDef } from '@tanstack/react-table';

export type Message = {
  _id: string;
  name: string;
  email: string;
  message: string;
};

export const columns: ColumnDef<Message>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'message', header: 'Message' },
];
```

---

## ✅ Step 9: Use the Table in Page

### `src/app/messages/page.tsx`

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { columns } from '@/components/ui/columns';
import { DataTable } from '@/components/ui/data-table';

async function fetchMessages() {
  const res = await fetch('/api/contact');
  return res.json();
}

export default function MessagesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages,
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Messages</h1>
      {!isLoading && data ? (
        <DataTable columns={columns} data={data.messages} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
```

---

## ✅ Step 10: Initialize Sanity Studio (Optional)

```bash
npm install -g sanity
sanity init
```

Choose the "Clean project" template and dataset: `production`


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

✅ You're now running a complete fullstack app!

