# Contributing to Permaculture Planner

First off, thank you for considering contributing to Permaculture Planner! It's people like you that make this tool a great resource for gardeners worldwide to grow food sustainably.

## Our Vision

We're building open-source tools that empower people to design and maintain productive permaculture gardens. Every contribution helps make sustainable food production more accessible.

## Ways to Contribute

### 🐛 Report Bugs
Found something that doesn't work right? [Open an issue](https://github.com/JohnConnorCode/permaculture-planner/issues/new?template=bug_report.md) with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser and OS information

### 💡 Suggest Features
Have an idea to make the tool better? [Create a feature request](https://github.com/JohnConnorCode/permaculture-planner/issues/new?template=feature_request.md) with:
- Problem you're trying to solve
- Proposed solution
- Alternative solutions considered
- Mockups or examples if available

### 📝 Improve Documentation
- Fix typos or clarify confusing sections
- Add examples and tutorials
- Translate documentation to other languages
- Create video guides

### 🌱 Contribute Garden Data
- Add companion planting relationships
- Expand crop database with varieties
- Add regional growing information
- Share successful garden templates

### 💻 Write Code
- Fix bugs from the issue tracker
- Implement requested features
- Improve performance
- Add tests

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git
- Supabase account (for backend features)

### Getting Started

1. **Fork the repository**
   ```bash
   # Click the 'Fork' button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/permaculture-planner.git
   cd permaculture-planner
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Code Guidelines

### Style Guide
- We use TypeScript for type safety
- Follow the existing code style (Prettier config included)
- Components should be functional with hooks
- Use meaningful variable and function names
- Add comments for complex logic

### Testing
- Write tests for new features
- Ensure existing tests pass: `npm run test`
- Add E2E tests for critical user flows: `npm run test:e2e`

### Commit Messages
- Use clear, descriptive commit messages
- Start with a verb: "Add", "Fix", "Update", "Remove"
- Reference issue numbers when applicable: "Fix #123: Resolve layout bug"

Example:
```
Add companion planting recommendations to bed designer

- Integrate companion planting data into bed planning
- Show warnings for incompatible plants
- Add visual indicators for beneficial combinations

Fixes #45
```

## Pull Request Process

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Test your changes**
   ```bash
   npm run test
   npm run build
   ```

3. **Submit pull request**
   - Provide clear description of changes
   - Link related issues
   - Include screenshots for UI changes
   - Check all tests pass

4. **Code review**
   - Address reviewer feedback
   - Keep discussions constructive
   - Be patient - maintainers are volunteers

## Project Structure

```
permaculture-planner/
├── app/                 # Next.js app router pages
├── components/          # Reusable React components
│   ├── ui/             # Base UI components
│   ├── garden/         # Garden-specific components
│   └── wizard/         # Setup wizard components
├── lib/                # Utilities and helpers
│   ├── supabase/       # Database client
│   ├── storage/        # Local storage utilities
│   └── validation/     # Data validation schemas
├── hooks/              # Custom React hooks
├── public/             # Static assets
├── styles/             # Global styles
└── tests/              # Test files
```

## Database Schema

Key tables:
- `users` - User accounts and preferences
- `sites` - Garden locations and settings
- `plans` - Garden design layouts
- `beds` - Individual bed configurations
- `crops` - Plant database
- `companions` - Companion planting relationships

## Community

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- No harassment or discrimination

### Getting Help
- Check existing documentation and issues
- Ask in [GitHub Discussions](https://github.com/JohnConnorCode/permaculture-planner/discussions)
- Join our community chat (coming soon)

### Recognition
All contributors will be recognized in our [Contributors](https://github.com/JohnConnorCode/permaculture-planner/graphs/contributors) page.

## Specific Contribution Areas

### 🌍 Localization
Help gardeners in your region:
- Translate the interface
- Add local plant varieties
- Include regional growing calendars
- Add cultural practices

### 📊 Data Science
Improve our recommendations:
- Enhance companion planting algorithms
- Add climate-based suggestions
- Optimize space utilization
- Analyze successful garden patterns

### 🎨 Design & UX
Make the tool more intuitive:
- Improve mobile experience
- Enhance accessibility (ARIA, keyboard navigation)
- Create better visualizations
- Design new UI components

### 📱 Mobile App
Help us go mobile:
- React Native development
- Offline functionality
- Camera integration for garden photos
- Push notifications for garden tasks

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions make sustainable gardening accessible to more people worldwide. Together, we're building tools that help communities grow food, share knowledge, and create resilient local food systems.

Happy gardening! 🌱