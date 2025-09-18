# Keel Stone Pathfinder - Next.js Application

This is the frontend application for the Keel Stone Pathfinder, built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── globals.css        # Global styles and design system
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main landing page
├── components/
│   ├── intake/
│   │   └── IntakeForm.tsx # Multi-step intake form
│   ├── plan/
│   │   └── PlanDisplay.tsx # 21-day plan visualization
│   └── ui/
│       ├── Icons.tsx      # Professional SVG icon library
│       ├── KeelStoneLogo.tsx # Logo component
│       └── LoadingState.tsx  # AI generation loading UI
└── lib/
    ├── types.ts           # TypeScript type definitions
    ├── mock-llm.ts        # Mock AI response system
    └── content-library.ts # Quotes and virtue content
```

## 🎨 Design System

### Custom CSS Classes

The application uses a custom design system built on Tailwind CSS:

#### Typography
- `.text-hero` - Large hero headlines (Playfair Display)
- `.text-display` - Section headlines (Playfair Display)  
- `.text-title` - Card/component titles (Playfair Display)
- `.text-subtitle` - Subheadings (Inter)
- `.text-quote` - Scripture/wisdom quotes (Lora italic)
- `.text-body` - Body text (Inter)
- `.text-caption` - Small text (Inter)

#### Components
- `.btn-primary` - Navy button with gold hover
- `.btn-secondary` - Gold button with darker hover
- `.btn-outline` - Outlined button with fill hover
- `.card` - Basic card with soft shadow
- `.card-elevated` - Card with hover effects
- `.input-field` - Form input with gold focus ring

#### Progress Indicators
- `.progress-dot` - Base progress dot styling
- `.progress-dot-completed` - Completed state (olive)
- `.progress-dot-current` - Current state (gold)
- `.progress-dot-pending` - Pending state (sand)

#### Backgrounds
- `.bg-hero` - Gradient hero background
- `.bg-section` - Content section background
- `.bg-accent` - Gold to olive gradient

### Color Palette

```css
/* Brand Colors */
--color-navy-900: #1F3A56    /* Deep Navy */
--color-slate-600: #5A6670   /* Slate Gray */
--color-gold-500: #C9A45C    /* Warm Gold */
--color-olive-500: #708C69   /* Olive Green */
--color-sand-100: #F9F9F6    /* Soft White */
--color-sand-400: #D9CBB4    /* Sand Beige */
```

## 🧩 Component Architecture

### State Management
- React `useState` for local component state
- Props drilling for shared state (assessment data, plan data)
- No external state management needed for current scope

### Key Components

#### `IntakeForm.tsx`
- Multi-step wizard (5 steps)
- Form validation and progress tracking
- Door selection (Christian/Secular)
- Bible version selection for Christian door
- Struggle identification and virtue mapping

#### `PlanDisplay.tsx`
- 21-day plan visualization
- Progress tracking with visual dots
- Expandable daily practice cards
- Quote display with Bible version support
- Export functionality (mock)

#### `LoadingState.tsx`
- AI generation simulation
- Dynamic loading messages
- Progress bar with realistic timing
- Cancellation support

#### Icon System (`Icons.tsx`)
- Professional SVG icons
- Consistent stroke width (2px)
- Brand color integration
- Scalable sizing system

## 🔧 Development Features

### Mock LLM System
The application includes a sophisticated mock system for testing AI interactions:

- **Realistic delays**: 1.5-3 second response times
- **Multiple models**: GPT-3.5, GPT-4, GPT-4 Turbo personalities
- **Error simulation**: Configurable error rates for testing
- **Content variation**: Different response styles (concise, detailed, balanced)

### Content Library
Pre-built content system with:
- Cardinal virtues framework (Wisdom, Courage, Justice, Temperance)
- Dual-door quotes (Christian and Secular)
- Bible version variations
- Practice templates and reflections

### Responsive Design
- **Desktop**: Sidebar navigation with logo
- **Mobile**: Collapsible header with fixed positioning
- **Breakpoints**: Tailwind's standard responsive system
- **Touch-friendly**: Appropriate sizing for mobile interactions

## 🔄 Development Workflow

### Adding New Features
1. Create components in appropriate directories
2. Use existing TypeScript types or extend them
3. Follow the established design system
4. Test across desktop and mobile
5. Maintain the contemplative, professional aesthetic

### Styling Guidelines
- Use custom CSS classes from the design system
- Prefer Tailwind utilities for spacing and layout
- Maintain consistent color usage
- Use proper semantic HTML
- Ensure accessibility with focus states

### Testing Approach
- Manual testing across different screen sizes
- Test the complete user flow (intake → loading → plan)
- Verify mock LLM responses work correctly
- Check responsive behavior on mobile devices

## 🚀 Deployment

### Development
```bash
npm run dev
```
Runs on `http://localhost:3000` with hot reloading.

### Production Build
```bash
npm run build
npm start
```
Creates optimized production build.

### Future Deployment (Azure)
The application is designed for deployment on Azure Static Web Apps with:
- Automatic builds from GitHub
- Custom domain support
- Global CDN distribution
- Serverless API integration

## 📦 Dependencies

### Core
- **Next.js 15**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling

### Development
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **@tailwindcss/postcss**: Tailwind integration

## 🎯 Performance Considerations

- **Next.js Image**: Optimized image loading for logo
- **CSS-in-JS**: Minimal runtime CSS with Tailwind
- **Code Splitting**: Automatic with Next.js App Router
- **Font Optimization**: Google Fonts with `font-display: swap`
- **Bundle Analysis**: Built-in Next.js analyzer

## 🔮 Future Enhancements

### Planned Features
- Real Azure OpenAI integration
- Database persistence (Cosmos DB)
- Email integration (ConvertKit)
- PDF/PNG export functionality
- User progress tracking
- Door switching capability

### Technical Improvements
- Unit testing with Jest/React Testing Library
- E2E testing with Playwright
- Performance monitoring
- Error boundary implementation
- Accessibility audit and improvements

---

*Built with contemplative care for inner steadiness.* 🧭