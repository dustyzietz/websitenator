
# ⚡ Template 3 – Vite + React + C# FastEndpoints + PostgreSQL

This fullstack template sets up a modern Vite frontend and a C# FastEndpoints backend with PostgreSQL and Entity Framework.

---

## 🧰 Tech Stack

- **Frontend**
  - Vite + React + TypeScript
  - Tailwind CSS v4
  - react-hook-form
- **Backend**
  - .NET 8
  - FastEndpoints
  - Entity Framework Core
  - PostgreSQL

---

## ✅ Step 1: Frontend – Create Vite + Tailwind App

```bash
npm create vite@latest hanalei-vite-app -- --template react-ts
cd hanalei-vite-app
npm install
npm install -D tailwindcss @tailwindcss/vite
npx tailwindcss init -p
```

### Configure Tailwind

**vite.config.ts**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**src/index.css**

```css
@import "tailwindcss";
```

Ensure it's imported in `main.tsx`:

```ts
import './index.css';
```

---

## ✅ Step 2: Add Contact Form

**src/pages/Contact.tsx**

```tsx
'use client';
import { useForm } from 'react-hook-form';

export default function Contact() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    const res = await fetch('https://localhost:5001/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("Message sent!");
      reset();
    } else {
      alert("Error submitting form.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6">
      <input {...register("name", { required: true })} placeholder="Name" className="block w-full border p-2 mb-4" />
      <input {...register("email", { required: true })} placeholder="Email" className="block w-full border p-2 mb-4" />
      <textarea {...register("message", { required: true })} placeholder="Message" className="block w-full border p-2 mb-4" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">Send</button>
    </form>
  );
}
```

---

## ✅ Step 3: Backend – Setup FastEndpoints API

### Create a new .NET project

```bash
dotnet new web -n HanaleiApi
cd HanaleiApi
dotnet add package FastEndpoints
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```

---

### Configure Entity

**Models/Message.cs**

```csharp
public class Message {
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Body { get; set; }
}
```

**Db/AppDbContext.cs**

```csharp
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Message> Messages => Set<Message>();
}
```

---

### Add Endpoint

**Endpoints/CreateMessage.cs**

```csharp
using FastEndpoints;

public class CreateMessageEndpoint : Endpoint<Message> {
    public AppDbContext Db { get; set; }

    public override void Configure() {
        Post("/api/messages");
        AllowAnonymous();
    }

    public override async Task HandleAsync(Message req, CancellationToken ct) {
        Db.Messages.Add(req);
        await Db.SaveChangesAsync(ct);
        await SendAsync(req);
    }
}
```

---

### Configure Program.cs

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDbContext>(o =>
    o.UseNpgsql(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddFastEndpoints();

var app = builder.Build();
app.UseFastEndpoints();
app.Run();
```

**appsettings.json**

```json
{
  "ConnectionStrings": {
    "Default": "Host=localhost;Port=5432;Username=postgres;Password=yourpassword;Database=hanalei"
  }
}
```

---

## ✅ Step 4: Run the Fullstack App

1. Run the API:

```bash
dotnet run
```

2. Run the Vite frontend:

```bash
npm run dev
```

---

You're done! Messages submitted in the form are stored in PostgreSQL using FastEndpoints and EF Core.

