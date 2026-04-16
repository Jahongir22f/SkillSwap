# SkillSwap Marketplace

A production-ready web platform for credit-based skill bartering.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [NPM](https://www.npmjs.com/) (usually comes with Node.js)
- A [Firebase](https://firebase.google.com/) account and project

### Installation

1. Clone the repository (if not already done) or navigate to the project folder.
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   Update the `firebaseConfig` in `lib/firebase.ts` with your credentials:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

4. Configure Video Calling:
   Update the `appID` and `serverSecret` in `app/video-call/[roomId]/page.tsx` with your ZegoCloud credentials.

### Running the App

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

- `/app` - Next.js pages and layouts
- `/components` - Reusable UI components
- `/lib` - Core logic (Firebase, Matching, Credits, i18n)
- `/models` - TypeScript interfaces and data models

## 🛠 Features

- **Credit Barter System**: 1 credit = 60 minutes of teaching.
- **Smart Matching**: Finds compatible users based on skills and location.
- **Real-time Chat**: Coordinate with your swap partners.
- **Video Calling**: In-app video sessions via ZegoCloud.
- **Wallet & History**: Track your earned and spent credits.
- **Multi-language**: Support for English, Uzbek, and Russian.
