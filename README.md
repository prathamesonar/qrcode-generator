# Digital Heroes QR Code Generator

A high-quality, modern QR Code Generator built with the MERN stack (MongoDB, Express, React, Node.js) + Vite.

##  Features
- **Modern UI/UX**: Glassmorphism, smooth animations, and a premium design.
- **Light & Dark Mode**: Built-in theme toggle to switch between sleek dark or vibrant light modes.
- **Instant QR Generation**: Real-time generation of high-quality QR codes.
- **History Tracking**: Automatically saves generated QR codes to MongoDB.
- **Serverless Ready**: Backend structured to deploy flawlessly on Vercel's Serverless Functions.

##  Technologies Used

**Frontend:**
- React 19 (via Vite)
- Vanilla CSS (Custom Design System & Theme Tokens)
- Lucide React (Icons)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Database & ORM)
- qrcode (QR code generation)

##  Project Structure

```text
├── api/
│   ├── models/
│   │   └── QRCode.js    # Mongoose schema for QR history
│   └── index.js         # Express backend & API routes
├── src/
│   ├── App.jsx          # Main React application logic
│   ├── index.css        # Global styling & Light/Dark themes
│   └── main.jsx         # React application entry point
├── .env                 # Environment variables (MongoDB URI)
├── package.json         # Project dependencies & scripts
├── vercel.json          # Vercel deployment configuration
└── vite.config.js       # Vite build tool configuration
```

##  Database Setup (MongoDB)

To enable QR code history tracking, you need to connect the app to a MongoDB database:

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (or use your existing cluster).
2. Create a `.env` file in the root directory of this project.
3. Add your connection string to the `.env` file:
   ```env
   MONGODB_URI="your_mongodb_connection_string_here"
   ```

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the application:**
   - start the Vite frontend:
     ```bash
     npm run dev
     ```
   - start the Express backend:
     ```bash
     node api/index.js
     ```

