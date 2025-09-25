# 🧭 Keel Stone Pathfinder

[![Azure Static Web Apps CI/CD](https://github.com/cdeyoung67/keelstone-pathfinder/actions/workflows/azure-static-web-apps.yml/badge.svg)](https://github.com/cdeyoung67/keelstone-pathfinder/actions/workflows/azure-static-web-apps.yml)

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

### 🎪 **Multi-Campaign Support**
Flexible campaign system that adapts the user experience based on how they discovered the app

## 🎪 Campaign System

The Keel Stone Pathfinder uses a sophisticated campaign system that provides different user experiences based on how people discover the app. This allows for personalized onboarding flows that match users' expectations and context.

### 🏗️ Architecture Overview

```
📁 Campaign System Structure
├── 🔧 config/campaigns.ts          # Campaign configurations
├── 🪝 hooks/useCampaign.ts         # Campaign state management
├── 🧭 components/campaign/
│   ├── CampaignRouter.tsx          # Routes to appropriate flows
│   └── flows/                      # Campaign-specific experiences
│       ├── Day6UndergroundFlow.tsx # 5-day email series completion
│       ├── SocialMediaFlow.tsx     # Social media optimized
│       └── DefaultFlow.tsx         # Standard experience
```

### 🎯 Supported Campaigns

| Campaign | URL Pattern | Experience |
|----------|-------------|------------|
| **Day 6 Underground** | `?campaign=day-6-underground` | Special welcome for 5-day email series completers |
| **Social Media** | `?source=social` | Social proof focused onboarding |
| **Referral** | `?source=referral` | Trust-based welcome for referred users |
| **Direct** | No parameters | Standard professional landing page |

### 🚀 Adding New Campaigns

Adding a new campaign is simple and follows a clear pattern:

#### **Step 1: Add Campaign Configuration**

Edit `pathfinder-app/src/config/campaigns.ts`:

```typescript
export const CAMPAIGN_CONFIGS: Record<string, CampaignConfig> = {
  // ... existing campaigns ...
  
  'my-new-campaign': {
    id: 'my-new-campaign',
    name: 'My New Campaign',
    description: 'Description of this campaign',
    urlPatterns: [
      'campaign=my-new-campaign',
      'utm_campaign=my-campaign-2024',
      'source=my-source'
    ],
    priority: 75, // Higher = higher priority
    enabled: true,
    metadata: {
      source: 'email-campaign',
      medium: 'email',
      emotionalTone: 'excitement-and-curiosity'
    }
  }
};
```

#### **Step 2: Create Campaign Flow (Optional)**

Create `pathfinder-app/src/components/campaign/flows/MyNewCampaignFlow.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useCampaign } from '@/hooks/useCampaign';
import DefaultFlow from './DefaultFlow';

export default function MyNewCampaignFlow() {
  const { campaign, context } = useCampaign();
  const [showWelcome, setShowWelcome] = useState(true);

  if (!showWelcome) {
    return <DefaultFlow campaignContext={context} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand-light to-sand-dark">
      {/* Your custom welcome experience */}
      <h1>Welcome from My New Campaign!</h1>
      <button onClick={() => setShowWelcome(false)}>
        Continue to Pathfinder
      </button>
    </div>
  );
}
```

#### **Step 3: Add to Router (Optional)**

Edit `pathfinder-app/src/components/campaign/CampaignRouter.tsx`:

```typescript
switch (campaign.id) {
  // ... existing cases ...
  
  case 'my-new-campaign':
    return <MyNewCampaignFlow />;
    
  default:
    return <DefaultFlow campaignContext={context} />;
}
```

### 🧪 Testing Campaigns

Test your campaigns locally:

```bash
# Default experience
http://localhost:3000

# Day 6 Underground
http://localhost:3000?campaign=day-6-underground

# Social Media
http://localhost:3000?source=social

# Your new campaign
http://localhost:3000?campaign=my-new-campaign
```

### 🔧 Campaign Hook Usage

Use the `useCampaign` hook in any component:

```typescript
import { useCampaign } from '@/hooks/useCampaign';

export default function MyComponent() {
  const { 
    campaign,           // Current campaign config
    context,            // Campaign context data
    isDay6Underground,  // Convenience boolean
    isSocialMedia,      // Convenience boolean
    shouldShowWelcome   // Whether to show welcome screen
  } = useCampaign();

  if (isDay6Underground) {
    return <SpecialDay6Content />;
  }

  return <RegularContent />;
}
```

### 📊 Campaign Analytics

Campaign data is automatically included in user assessments:

```typescript
// Assessment object includes campaign context
{
  firstName: "John",
  email: "john@example.com",
  // ... other fields ...
  campaignContext: {
    source: 'day-6-underground',
    campaignId: 'underground-calls-2024',
    entryPoint: 'email-link',
    priorContext: ['day-1', 'day-2', 'day-3', 'day-4', 'day-5']
  }
}
```

### 🎨 Campaign Best Practices

1. **Keep URLs Simple**: Use clear, memorable parameter names
2. **Set Appropriate Priorities**: Higher numbers override lower ones
3. **Test Thoroughly**: Always test new campaigns locally first
4. **Use DefaultFlow**: Leverage the existing flow for consistency
5. **Consider Mobile**: All campaign experiences should be responsive
6. **Track Context**: Campaign data is automatically saved for analytics

### 🐛 Debugging Campaigns

Enable debug logging by checking the browser console:

```javascript
// You'll see logs like:
🎯 Campaign detected: { campaign: "Day 6 Underground", id: "day-6-underground" }
🔍 Campaign detection - URL params: { campaign: "day-6-underground" }
✅ Day 6 Underground campaign detected
```

### 🔄 Campaign Migration

When updating campaigns:

1. **Backward Compatibility**: Keep old URL patterns working
2. **Gradual Rollout**: Use the `enabled` flag to control visibility
3. **A/B Testing**: Create multiple campaigns with different priorities
4. **Analytics**: Monitor campaign performance through assessment data

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

## 🚀 Environments & Deployment

### 🎭 Demo Environment (Always Working)
**Purpose**: Prospective user demonstrations with mock data

- **URL**: https://purple-coast-078b3150f.2.azurestaticapps.net
- **Resource Group**: `rg-pathfinder-demo`
- **Data Source**: Mock data only (no backend dependencies)
- **Status**: ✅ Always stable and functional
- **Use Case**: Sales demos, user testing, stakeholder presentations

**Deploy Demo Environment:**
```powershell
.\infrastructure\scripts\deploy-demo-environment.ps1
```

### 🔧 Development Environment (Real Cloud Services)
**Purpose**: Development and testing with real Azure services

- **URL**: https://purple-island-09347f60f.1.azurestaticapps.net
- **Resource Group**: `rg-keelstone-dev-core-2`
- **Data Source**: Azure Functions + Cosmos DB + OpenAI
- **Status**: ⚠️ Can be broken during development
- **Use Case**: Feature development, integration testing, debugging

**Deploy Development Environment:**
```powershell
# Deploy core infrastructure
.\infrastructure\scripts\deploy-core-only.ps1

# Deploy Azure Functions code
.\infrastructure\scripts\deploy-functions.ps1

# Deploy Static Web App manually
.\infrastructure\scripts\deploy-static-web-app-manual.ps1
```

### 💻 Local Development Environment
**Purpose**: Development without cloud dependencies

- **URL**: http://localhost:3000 (frontend) + http://localhost:7071 (backend)
- **Data Source**: Mock services (configurable)
- **Cost**: $0 (no cloud resources)
- **Use Case**: Feature development, rapid iteration

**Start Local Development:**
```bash
# Frontend
cd pathfinder-app
npm run dev

# Backend (optional - uses mock services)
cd pathfinder-api
npm run start
# OR use pure Node.js dev server
node dev-server.js
```

### 🏭 Production Environment (Future)
**Purpose**: Live production system for real users

- **Status**: Not yet deployed
- **Planned Stack**: Azure Static Web Apps + Functions + Cosmos DB + OpenAI
- **Domain**: Custom domain with SSL
- **Monitoring**: Application Insights + Azure Monitor

## 📋 Environment Configuration

### Environment Variables

**Demo Environment:**
```bash
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_ENVIRONMENT=demo
NEXT_PUBLIC_API_BASE_URL=""
```

**Development Environment:**
```bash
NEXT_PUBLIC_API_BASE_URL=https://pathfinder-test-functions-uxt4dm.azurewebsites.net
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_USE_MOCK_DATA=false
```

**Local Development:**
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:7071
NEXT_PUBLIC_ENVIRONMENT=development
# Mock services used automatically if backend not available
```

### Service Configuration

The application uses a **Service Factory Pattern** to automatically switch between:
- **Real Services**: When Azure credentials are configured
- **Mock Services**: When running locally or when real services are unavailable

This ensures the app always works, even during development or service outages.

## 🛠️ Infrastructure as Code

### Available Deployment Scripts

| Script | Purpose | Creates |
|--------|---------|---------|
| `deploy-demo-environment.ps1` | Demo with mock data | Static Web App only |
| `deploy-core-only.ps1` | Core infrastructure | Functions, Cosmos DB, OpenAI, Storage |
| `deploy-functions.ps1` | Deploy API code | Updates existing Function App |
| `deploy-static-web-app-manual.ps1` | Frontend deployment | Static Web App with manual GitHub setup |
| `deploy-full-iac.ps1` | Complete with CI/CD | Everything + GitHub Actions |

### Bicep Templates

- `infrastructure/bicep/main.bicep` - Complete infrastructure
- `infrastructure/bicep/main-core-only.bicep` - Core services only
- `infrastructure/bicep/staticwebapp-demo.bicep` - Demo environment
- `infrastructure/bicep/modules/` - Individual service modules

### GitHub Actions Workflows

- `.github/workflows/azure-static-web-apps.yml` - Development environment
- `.github/workflows/azure-static-web-apps-demo.yml` - Demo environment
- `.github/workflows/azure-static-web-apps-core-2.yml` - Alternative development

## 🎯 Quick Start Guide

### For Demos
1. Use the demo environment: https://purple-coast-078b3150f.2.azurestaticapps.net
2. Always works with realistic mock data
3. Perfect for showing prospective users

### For Development
1. **Local**: `npm run dev` in `pathfinder-app/`
2. **Cloud**: Use development environment URL
3. **Testing**: Run `node pathfinder-api/test-intake.js`

### For Deployment
1. **Demo**: `.\infrastructure\scripts\deploy-demo-environment.ps1`
2. **Development**: `.\infrastructure\scripts\deploy-core-only.ps1`
3. **Full Stack**: `.\infrastructure\scripts\deploy-full-iac.ps1`

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
