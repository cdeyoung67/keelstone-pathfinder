# Pathfinder Frontend Build Modes

The Pathfinder frontend supports multiple build modes to accommodate different audiences and use cases.

## 🎯 Build Commands

### Demo Mode
```bash
npm run build:demo
npm run start:demo
```
- **Purpose**: Sales presentations, investor demos
- **Features**: Uses mock data, always works, clean UX
- **Verbosity**: Off (no technical details)
- **Banner**: "DEMO MODE - Using Mock Data"

### Development Mode
```bash
npm run build:dev
npm run start:dev
# OR
npm run dev  # (for live development)
```
- **Purpose**: Development, debugging, technical demos
- **Features**: Real API, full technical visibility, debugging tools
- **Verbosity**: High (show all agent details)
- **Banner**: "DEV MODE - Real/Mock API"

### Production Mode
```bash
npm run build:prod
npm start
```
- **Purpose**: Customer-facing production deployment
- **Features**: Real API, clean customer experience
- **Verbosity**: Low (minimal technical details)
- **Banner**: None (clean production look)

## 🔧 Environment Variables

### Core Configuration
- `NEXT_PUBLIC_API_BASE_URL` - Azure Functions endpoint
- `NEXT_PUBLIC_USE_MOCK_DATA` - Force mock data usage
- `NEXT_PUBLIC_DEMO_MODE` - Enable demo mode
- `NEXT_PUBLIC_ENVIRONMENT` - Environment type (demo/development/production)

### Multi-Agent Display
- `NEXT_PUBLIC_AGENT_VERBOSITY` - off/low/medium/high
- `NEXT_PUBLIC_DEBUG_MODE` - Show technical details
- `NEXT_PUBLIC_SHOW_TECHNICAL_DETAILS` - Show agent names, timing
- `NEXT_PUBLIC_ENABLE_MULTI_AGENT_DISPLAY` - Enable progress tracker
- `NEXT_PUBLIC_SHOW_RESPONSE_TIMES` - Show API timing
- `NEXT_PUBLIC_SHOW_PLAN_VERSIONS` - Show plan metadata

## 🎭 Verbosity Levels

### Off
- **Message**: "Creating your personalized journey..."
- **Progress**: Simple loading spinner
- **Audience**: End customers who just want results

### Low
- **Message**: "AI is crafting your personalized 21-day plan..."
- **Progress**: Basic progress indication
- **Audience**: General users who appreciate AI mention

### Medium
- **Message**: "Multiple AI specialists are creating your plan..."
- **Progress**: Shows agent types without technical jargon
- **Audience**: Tech-aware users, investor demos

### High
- **Message**: "Multi-agent system generating your personalized plan..."
- **Progress**: Full technical details, agent names, timing
- **Audience**: Developers, technical stakeholders

## 🚀 Multi-Agent Progress Features

### Progress Tracker
- Todo-style checklist with real-time updates
- Estimated vs actual timing
- Agent-specific progress steps
- Visual progress bar

### Agent Visibility
- **High**: "Concierge Agent: Orchestrating your personalized path"
- **Medium**: "AI specialists creating your practices"
- **Low**: "Crafting your 21-day journey"
- **Off**: No agent mention

### Technical Details
- Response times and token usage
- Plan version information
- API endpoint status
- Debug console logging

## 🔄 Fallback Strategy

The system gracefully handles API failures:

1. **Primary**: Real multi-agent API
2. **Fallback**: Mock data generation
3. **Error**: Clear error messages (dev mode) or graceful degradation (prod mode)

## 📱 Responsive Design

All modes maintain the same responsive design and accessibility features while adjusting information density based on the target audience.
