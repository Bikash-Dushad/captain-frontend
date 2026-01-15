# Rider Captain - Frontend Application

A React application for rider/captain management with phone number authentication and Google Maps integration.

## Features

- 🔐 Phone number authentication with OTP verification
- 🗺️ Google Maps integration showing current location
- 📊 Dashboard with ride statistics (Total Rides, Earnings, Rating)
- 🎨 Modern and responsive UI design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Google Maps API Key:
   - Create a `.env` file in the root directory
   - Add your Google Maps API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
   - Get your API key from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── contexts/
│   └── AuthContext.jsx      # Authentication context
├── pages/
│   ├── LoginPage.js         # Phone/OTP login page
│   ├── LoginPage.css
│   ├── HomePage.js          # Main dashboard
│   └── HomePage.css
├── App.jsx                  # Main app component with routing
└── main.jsx                 # Entry point
```

## Usage

1. **Login**: Enter your phone number and verify with OTP
2. **Home Page**: View your dashboard with ride statistics
3. **Show Location**: Click "Show My Location" button to display Google Maps with your current location

## Note

- The OTP verification is currently mocked for demo purposes. In production, integrate with your backend API.
- Make sure to enable location services in your browser for the map feature to work.

## Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.
