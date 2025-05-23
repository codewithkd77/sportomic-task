# Sports Venue Booking Application

A full-stack web application for booking sports venues, built with **React** (frontend), **Express.js** (backend), and **Supabase** (database). The project supports user bookings, admin management, and is deployable on Vercel and Render.

---

## 🚀 Tech Stack

### Frontend
- **React**: Modern, component-based UI library for building interactive user interfaces.
- **CSS**: For styling components.

### Backend
- **Node.js** & **Express.js**: Fast, minimalist server for handling API requests.
- **Supabase**: Open-source Firebase alternative for authentication and PostgreSQL database.
- **CORS** & **body-parser**: Middleware for handling cross-origin requests and JSON payloads.
- **dotenv**: For managing environment variables.

### Deployment
- **Vercel**: For deploying both frontend and backend (serverless functions).
- **Render**: Alternative backend deployment.
- **GitHub**: Source code management and CI/CD integration.

---

## 📁 Project Structure

```
task-deploy/
│
├── client/                # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── AdminPortal.js
│   │   └── ...other files
│   ├── public/
│   └── package.json
│
├── server/                # Express backend
│   ├── index.js
│   ├── supabase.js
│   └── package.json
│
├── vercel.json            # Vercel deployment config
├── README.md              # Project documentation
└── .env                   # Environment variables (not committed)
```

---

## 🌟 Features

- **Venue listing** and time slot management
- **User booking** with conflict prevention
- **Admin portal** for viewing, updating, and deleting bookings
- **Supabase integration** for persistent data storage
- **CORS** configuration for secure cross-origin requests
- **Deployment-ready** for Vercel and Render

---

## ⚙️ How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/sportomic-task.git
cd sportomic-task
```

### 2. Set Up Environment Variables

Create a `.env` file in both `server/` and `client/` directories.

#### For Backend (`server/.env`):

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
PORT=5000
```

#### For Frontend (`client/.env`):

```
REACT_APP_API_URL=http://localhost:5000
```

### 3. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

### 4. Start the Development Servers

#### Backend

```bash
cd server
npm start
```

#### Frontend

```bash
cd ../client
npm start
```

- Frontend runs on [http://localhost:3000](http://localhost:3000)
- Backend runs on [http://localhost:5000](http://localhost:5000)

---

## 🛠️ How to Deploy

### Backend

- **Vercel**: Root `vercel.json` is configured for serverless deployment.
- **Render**: Deploy `server/` as a Node.js web service.

### Frontend

- **Vercel**: Deploy `client/` as a static site.
- Update `REACT_APP_API_URL` in Vercel dashboard to your deployed backend URL.

---

## 📝 Supabase Table Structure

**venues**
- `id` (int, primary key)
- `name` (text)

**bookings**
- `id` (int, primary key)
- `name` (text)
- `sport` (text)
- `venue` (text)
- `date` (date)
- `time_slot` (text)

---

## 🔒 Security & Best Practices

- **CORS**: Only allows requests from trusted domains.
- **Environment Variables**: Never commit secrets to source control.
- **Error Handling**: All API endpoints return meaningful error messages.

---

## 🙋‍♂️ Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Create a new Pull Request

---

## 📞 Support

For questions or support, open an issue or contact the maintainer.

---
