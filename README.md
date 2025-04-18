# Frontend – React (Vite) App

This is a simple front-end application built with React that allows users to view, add, edit, and delete project entries. It is designed to work with a RESTful ASP.NET Web API backend and uses API key authentication instead of a traditional login system.

## Features

- **CRUD Operations:** Add, view, update, and delete projects.
- **Filtering:** Filter projects by status (e.g., "All" or "Completed").
- **Clean UI:** User-friendly layout and modal-based interactions for adding and editing projects.

## Technical Overview

- **Framework:** React with Vite for fast development and bundling.
- **API Communication:** Uses `fetch` via a small helper (`api.js`) that automatically includes the API key.
- **State Management:** Uses `useState`, `useEffect`, and props to manage state and UI flow.
- **Modal Forms:** Reusable modals for both creating and editing projects.
- **Styling:** Simple CSS and responsive layout for clean interaction.

## API Authentication

Instead of login functionality, the app uses an API key passed in the `x-api-key` header for all requests to the backend API.

## Setup and Development

1. Clone the repo.
2. Create a `.env` file in the root and configure:
   ```env
   VITE_API_URL=https://your-api-url/api
   VITE_API_KEY=your-api-key-here
   ```
3. Run the dev server:
   ```bash
   npm install
   npm run dev
   ```

## Deployment

- Build for production using `npm run build`.
- Deploy the contents of the `dist/` folder to your preferred static hosting (e.g., Azure Static Web App, Netlify, Vercel).

## Technologies Used

- React
- Vite
- Vanilla CSS
- REST API Integration (with API key auth)

## Notes

This frontend assumes the backend is already deployed and exposes a set of endpoints for managing projects via an API key. Make sure CORS is properly configured on the backend to allow your deployed frontend to communicate with it.

