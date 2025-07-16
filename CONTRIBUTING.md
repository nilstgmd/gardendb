# Contributing to Garden Manager

Thank you for your interest in contributing to Garden Manager! This guide will help you get started and ensure consistency across the project.

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Git

### Setup
1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## 📝 Documentation Requirements

### **IMPORTANT: README Updates**
When adding any new feature, you **MUST** update the README.md file:

1. **Add to Features Section**: Document new functionality under the appropriate category
2. **Update Architecture**: If adding new components, update the component structure
3. **Update Usage Guide**: Add instructions for using new features
4. **Update Changelog**: Add your changes to the current version or create a new version entry

### README Update Checklist
- [ ] Feature documented in appropriate section
- [ ] Component structure updated (if applicable)  
- [ ] Usage instructions added
- [ ] Configuration options documented (if applicable)
- [ ] Changelog updated
- [ ] Screenshots updated (if UI changes)

## 🔧 Development Guidelines

### Code Style
- Use Vue 3 Composition API
- Follow existing naming conventions
- Add JSDoc comments for complex functions
- Use TypeScript-style prop definitions
- Maintain responsive design principles

### Component Guidelines
- Keep components focused and reusable
- Use props for data input, emit events for actions
- Follow the existing error handling patterns
- Add loading states for async operations
- Include proper accessibility attributes

### State Management
- Use Pinia store for shared state
- Keep component-specific state local
- Use computed properties for derived data
- Follow the existing store patterns

## 🧪 Testing

### Manual Testing Checklist
- [ ] Feature works on desktop and mobile
- [ ] Error handling displays appropriate messages
- [ ] Loading states work correctly
- [ ] Data persists correctly in localStorage
- [ ] Accessibility features work (keyboard navigation, screen readers)
- [ ] No console errors or warnings

### Test Your Changes
Before submitting:
```bash
# Build and test production version
npm run build
npm run preview

# Test in different browsers if possible
# Test on mobile device or browser dev tools
```

## 📦 Submitting Changes

### Pull Request Process
1. **Update Documentation**: Ensure README.md reflects your changes
2. **Test Thoroughly**: Manual testing across devices
3. **Clean Commit History**: Squash commits if necessary
4. **Descriptive PR**: Clearly describe what was added/changed

### Pull Request Template
```markdown
## What Changed
- Brief description of new feature/fix

## Documentation Updated
- [ ] README.md updated with new feature
- [ ] Component structure updated
- [ ] Usage instructions added
- [ ] Changelog updated

## Testing Done
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Tested error scenarios
- [ ] Checked accessibility

## Screenshots (if applicable)
[Add screenshots of new features]
```

## 🎯 Feature Development Workflow

### 1. Plan Your Feature
- Check existing issues/discussions
- Consider impact on existing functionality
- Plan documentation updates

### 2. Develop
- Create feature branch
- Follow coding guidelines
- Add error handling
- Test incrementally

### 3. Document
- Update README.md immediately
- Add inline code comments
- Consider creating examples

### 4. Test & Submit
- Comprehensive testing
- Update documentation
- Submit pull request

## 📋 Common Tasks

### Adding a New Component
1. Create component in `src/components/`
2. Follow existing naming convention
3. Add to README component structure
4. Document props and events
5. Add usage example to README

### Adding a Store Feature
1. Add to `src/stores/plants.js`
2. Follow existing patterns
3. Update README features section
4. Add error handling
5. Test data persistence

### UI/UX Changes
1. Maintain design consistency
2. Test responsive behavior
3. Update screenshots in README
4. Verify accessibility
5. Test on multiple devices

## 🐛 Bug Reports

When reporting bugs:
- Use GitHub issues
- Include steps to reproduce
- Include browser/OS information
- Add screenshots if applicable
- Check existing issues first

## 💡 Feature Requests

For new features:
- Open GitHub issue with "enhancement" label
- Describe the use case
- Consider implementation complexity
- Discuss with maintainers first

## 📚 Resources

### Vue 3 Resources
- [Vue 3 Documentation](https://vuejs.org/)
- [Composition API Guide](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Pinia Documentation](https://pinia.vuejs.org/)

### Design Guidelines
- Follow existing glass-morphism aesthetic
- Use consistent spacing and colors
- Maintain mobile-first responsive design
- Ensure good contrast ratios

### Accessibility
- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers when possible

## 🔄 Release Process

### Version Numbering
- Follow semantic versioning (major.minor.patch)
- Update version in package.json
- Update README changelog
- Tag releases in Git

### Documentation Updates
For each release:
1. Update README changelog
2. Move features from "Planned" to "Current"
3. Add new planned features if any
4. Update version numbers
5. Create release notes

---

Thank you for contributing to Garden Manager! 🌱

Your contributions help make gardening more accessible and enjoyable for everyone. 