# ValoHub

**ValoHub** is a next-generation Valorant companion web application designed to provide players with deep insights, tactical data, and customization tools. Built with modern web technologies, it offers a premium, high-performance user experience.

![ValoHub Banner](https://img.shields.io/badge/VALORANT-Hub-ff4655?style=for-the-badge&logo=valorant&logoColor=white)

## Key Features

### Agent Base
- **Detailed Profiles**: Complete breakdown of every agent, including lore, roles, and ability videos.
- **Tech UI**: Immersive, futuristic interface inspired by Valorant's own aesthetic.

### Map Command
- **Tactical Intel**: Interactive maps with callouts, attack/defense strategies, and historical release timelines.
- **3D-Style Cards**: Interactive holographic map cards with motion effects.

### Armory
- **Weapon Stats**: Comprehensive damage fall-off tables, fire rates, and wall penetration data.
- **Skin Viewer**: Browse weapon skins with chroma support and rarity tiers.
- **Economy Guide**: Price and shop data for efficient credit management.

### Crosshair Lab
- **Pro Gallery**: curated database of pro player crosshairs (TenZ, Demon1, etc.).
- **Import/Export**: Parse and preview standard Valorant crosshair codes.
- **Editor**: Fine-tune your reticle with live preview.

### Squad Builder
- **Team Composition**: Build your dream team for specific maps.
- **Meta Analysis**: instant feedback on team balance (Roles, Utility) based on map-specific meta.

### Performance & Security
- **Smart Caching**: Frontend data management with TanStack Query and Backend caching with Redis for instant load times.
- **Secure Validation**: Type-safe form handling using Zod and React Hook Form ensuring robust data integrity.

## Tech Stack

**Frontend:**
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State & Caching**: [TanStack Query v5](https://tanstack.com/query)
- **Validation**: [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

**Backend:**
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (with Mongoose)
- **Caching**: [Redis](https://redis.io/) (for API rate limiting & data caching)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas URI)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/valohub.git
   cd valohub
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Server Port
   PORT=5000
   
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/valohub
   ```

### Running the App

To run both Frontend and Backend concurrently (if configured) or separately:

**1. Start the Backend Server**
```bash
npm run server
```
*Server runs on `http://localhost:5000`*

**2. Start the Frontend Development Server**
```bash
npm run dev
```
*Client runs on `http://localhost:5173`*

## Project Structure

```
ValoHub/
├── server/                 # Backend API (Express + Mongoose)
│   ├── controllers/        # Logic for Agents, Maps, Crosshairs
│   ├── models/             # MongoDB Schemas
│   └── routes/             # API Endpoint definitions
├── src/                    # Frontend Application
│   ├── components/         # Reusable UI components
│   ├── data/               # Static Types & Interfaces
│   ├── pages/              # Main route pages (Home, Agents, Maps...)
│   ├── services/           # API fetchers & utilities
│   └── utils/              # Parsers & Helper functions
└── ...config files         # Vite, Tailwind, TSConfig
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any features or bug fixes.

## License

This project is open-source and available under the [MIT License](LICENSE).

---

*Verified Compliance with Riot Games API usage (if applicable).*
*ValoHub isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties.*
