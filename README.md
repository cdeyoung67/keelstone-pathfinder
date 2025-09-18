# 🧭 Keel Stone Pathfinder

> **Find Your Path to Inner Steadiness**

A personalized 21-day practice agent that helps users break free from digital overwhelm through contemplative practices. Choose your path—Christian or secular—and discover daily habits that bring calm, clarity, and purpose.

![Keel Stone Pathfinder](./pathfinder-app/public/keel-stone-logo.png)

## 🎯 Project Overview

The Keel Stone Pathfinder is an onboarding experience that converts new subscribers into engaged participants by creating personalized 21-day practice plans based on their struggles and preferences. It uses a short interactive intake, dynamically generates plans through Azure OpenAI, and connects users to daily drip sequences tailored to their chosen path.

### Two Doors, One Solution

- **Christian Door**: Includes scripture references (multiple Bible versions), prayer prompts, and grace-first framing
- **Secular Door**: Uses classical virtues, Stoic insights, and CBT-style reframing

## ✨ Key Features

### 🎯 **Personalized**
Your plan adapts to your struggles, schedule, and spiritual preferences

### ⏱️ **Bite-Sized** 
5-20 minute daily practices that fit into your real life

### 🚪 **Two Paths**
Christian (with Scripture) or Secular (with philosophy)—your choice

## 🏗️ Architecture

### Current Implementation (UI-First)
- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Mock Backend**: Simulated AI responses for UX validation
- **Design System**: Custom brand colors, typography, and professional icons
- **Responsive**: Mobile-first design with sidebar navigation

### Planned Architecture (Azure-Native)
- **Frontend**: Azure Static Web Apps (Next.js)
- **Backend**: Azure Functions (HTTP triggers)
- **Database**: Azure Cosmos DB (Core/SQL)
- **AI**: Azure OpenAI Service (GPT-4) with content filtering
- **Email**: ConvertKit integration via Azure Logic Apps
- **Storage**: Azure Blob Storage for plan exports
- **Monitoring**: Application Insights + Azure Monitor

## 🎨 Design System

### Color Palette
- **Deep Navy** (`#1F3A56`) - Primary anchor
- **Slate Gray** (`#5A6670`) - Secondary anchor  
- **Warm Gold** (`#C9A45C`) - Accent color
- **Olive Green** (`#708C69`) - Accent color
- **Soft White** (`#F9F9F6`) - Background
- **Sand Beige** (`#D9CBB4`) - Background variant

### Typography
- **Headlines**: Playfair Display (elegant serif for timeless wisdom)
- **Body Text**: Inter (modern sans-serif for readability)
- **Quotes**: Lora (light italic serif for scripture and wisdom)

### Visual Style
- **Contemplative**: Ample white space and thoughtful spacing
- **Professional**: Clean lines and subdued colors
- **Accessible**: High contrast and clear hierarchy
- **Timeless**: Classic design that won't feel dated

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pathfinderV1
   ```

2. **Install dependencies**
   ```bash
   cd pathfinder-app
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Project Structure
```
pathfinderV1/
├── Docs/                          # Project documentation
│   ├── prd_keel_stone_pathfinder_personalized_14_day_practice_agent.md
│   ├── pdq_keel_stone_pathfinder.md
│   └── Value Prop.md
├── pathfinder-app/               # Next.js application
│   ├── src/
│   │   ├── app/                  # App router pages
│   │   ├── components/           # React components
│   │   │   ├── intake/           # Intake form components
│   │   │   ├── plan/             # Plan display components
│   │   │   └── ui/               # Reusable UI components
│   │   └── lib/                  # Utilities and types
│   │       ├── types.ts          # TypeScript definitions
│   │       ├── mock-llm.ts       # Mock AI responses
│   │       └── content-library.ts # Quotes and virtue content
│   ├── public/                   # Static assets
│   └── package.json
└── README.md
```

## 🧪 Development Phases

### ✅ Phase 1: UI-First Development (Complete)
- [x] Next.js foundation with Tailwind CSS
- [x] Complete user intake flow
- [x] Mock LLM system with realistic delays
- [x] Plan display with progress tracking
- [x] Professional design system implementation
- [x] Responsive sidebar navigation
- [x] Professional icon system

### 🔄 Phase 2: Core Infrastructure (Planned)
- [ ] Azure Functions setup
- [ ] Cosmos DB integration
- [ ] Real Azure OpenAI integration
- [ ] Email capture and validation

### 🔄 Phase 3: AI Plan Generation (Planned)
- [ ] Prompt engineering for both doors
- [ ] Cardinal virtues integration
- [ ] Bible version selection
- [ ] Content personalization

### 🔄 Phase 4: Email Integration (Planned)
- [ ] ConvertKit API integration
- [ ] Azure Logic Apps setup
- [ ] 21-day email sequences
- [ ] User segmentation and tagging

## 📊 Success Metrics

### Activation Goals
- ≥65% Day-1 open rate
- ≥50% intake completion
- <90 seconds intake completion time

### Engagement Goals
- ≥40% Day-3 engagement
- ≥25% Day-7 engagement
- NPS ≥55 at Day-7 micro-survey

### Personalization Goals
- 100% users tagged by door + primary struggle
- Correct routing to appropriate drip sequences

## 🎭 User Personas

### Overloaded Analyst (Secular)
Wants focus and habit structure without religious framing

### Quiet Believer (Christian) 
Wants gentle scripture-based guidance with grace-first approach

### Burned-Out Parent
Needs 5-10 minute practices with easy wins and flexibility

## 🔐 Privacy & Security

- **Data Minimization**: Only collect essential information
- **Encryption**: All data encrypted at rest and in transit
- **GDPR Compliance**: One-click delete functionality
- **Privacy First**: No tracking without consent
- **Secure Storage**: Azure-native security features

## 🚀 Deployment

### Current (Development)
```bash
npm run build
npm start
```

### Planned (Production)
- **Azure Static Web Apps**: Automatic deployment from GitHub
- **Custom Domain**: Professional domain with SSL
- **Global CDN**: Fast loading worldwide
- **Auto-scaling**: Handle traffic spikes gracefully

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and patterns
- Use TypeScript for type safety
- Write meaningful commit messages
- Test thoroughly across different devices
- Maintain the contemplative, professional design aesthetic

## 📚 Resources

### Documentation
- [PRD - Full Product Requirements](./Docs/prd_keel_stone_pathfinder_personalized_14_day_practice_agent.md)
- [PDQ - Quick Validation Version](./Docs/pdq_keel_stone_pathfinder.md)
- [Value Proposition Canvas](./Docs/Value%20Prop.md)

### Design References
- **Typography**: Playfair Display, Inter, Lora
- **Icons**: Custom minimal SVG icon system
- **Layout**: Contemplative spacing with professional hierarchy
- **Colors**: Warm, earthy palette inspired by natural elements

### Technical Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Future Backend**: Azure Functions, Cosmos DB, OpenAI
- **Deployment**: Azure Static Web Apps
- **Email**: ConvertKit integration

## 📞 Contact

**The Keel Stone**  
Building tools for inner steadiness in a chaotic world.

---

## 🙏 Acknowledgments

- **Cardinal Virtues Framework**: Wisdom, Courage, Justice, Temperance
- **Fruit of the Spirit Approach**: "Brave, but not reckless; Wise, but not proud"
- **Design Inspiration**: Contemplative practices and timeless wisdom traditions

---

*"Today I will practice steadiness — small, consistent, unhurried."*
