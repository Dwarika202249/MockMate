<div align="center">

# 🤝 Contributing to MockMate

First off, **thank you** for considering contributing to MockMate! 🎉

It's people like you that make MockMate such a great tool for interview preparation.

</div>

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [How Can I Contribute?](#-how-can-i-contribute)
- [Development Setup](#-development-setup)
- [Coding Standards](#-coding-standards)
- [Commit Guidelines](#-commit-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Issue Guidelines](#-issue-guidelines)
- [Community](#-community)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming, inclusive environment. By participating, you are expected to uphold this standard.

### Our Standards

✅ **Do:**
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

❌ **Don't:**
- Use sexualized language or imagery
- Troll, insult, or make derogatory comments
- Engage in personal or political attacks
- Publish others' private information without permission
- Conduct yourself unprofessionally

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher (or **yarn** 1.22+)
- **MongoDB** 6.0 or higher
- **Git** 2.40 or higher
- A **GitHub** account

### Fork & Clone

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/mockmate.git
cd mockmate
```

3. **Add upstream** remote:

```bash
git remote add upstream https://github.com/mockmate/mockmate.git
```

4. **Verify** remotes:

```bash
git remote -v
# origin    https://github.com/YOUR_USERNAME/mockmate.git (fetch)
# origin    https://github.com/YOUR_USERNAME/mockmate.git (push)
# upstream  https://github.com/mockmate/mockmate.git (fetch)
# upstream  https://github.com/mockmate/mockmate.git (push)
```

---

## 💡 How Can I Contribute?

### 🐛 Reporting Bugs

Found a bug? Help us squash it!

1. **Search existing issues** to avoid duplicates
2. **Create a new issue** using the bug report template
3. **Include:**
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/videos if applicable
   - Environment details (OS, browser, Node version)

```markdown
### Bug Description
A clear description of the bug.

### Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

### Expected Behavior
What should have happened.

### Screenshots
If applicable, add screenshots.

### Environment
- OS: [e.g., Windows 11, macOS 14]
- Browser: [e.g., Chrome 120]
- Node.js: [e.g., 20.10.0]
```

### ✨ Suggesting Features

Have an idea? We'd love to hear it!

1. **Check the roadmap** in README.md
2. **Search existing issues** for similar suggestions
3. **Create a feature request** with:
   - Problem you're trying to solve
   - Proposed solution
   - Alternative solutions considered
   - Additional context

### 📝 Improving Documentation

Documentation improvements are always welcome:

- Fix typos or clarify existing docs
- Add missing documentation
- Improve code comments
- Create tutorials or guides

### 💻 Contributing Code

Ready to code? Here's how:

1. Find an issue labeled `good first issue` or `help wanted`
2. Comment on the issue to claim it
3. Follow the development setup below
4. Submit a pull request

---

## 🛠️ Development Setup

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Configuration

```bash
# Copy environment templates
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**Backend `.env`:**
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/mockmate_dev
JWT_SECRET=dev-secret-change-in-production
GROQ_API_KEY=your-groq-api-key
GOOGLE_CLIENT_ID=your-google-client-id
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### 3. Start Development Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 4. Verify Setup

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

---

## 📏 Coding Standards

### JavaScript/React

We follow modern JavaScript best practices:

```javascript
// ✅ Good: Functional components with hooks
const InterviewCard = ({ interview, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white/5 rounded-2xl p-6"
    >
      {/* Component content */}
    </motion.div>
  );
};

// ❌ Avoid: Class components (unless necessary)
class InterviewCard extends Component { ... }
```

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `InterviewCard.jsx` |
| Hooks | camelCase with `use` prefix | `useWebSocket.js` |
| Utils | camelCase | `aiProvider.js` |
| Constants | SCREAMING_SNAKE_CASE | `API_ENDPOINTS.js` |
| Styles | kebab-case | `interview-card.css` |

### Component Structure

```jsx
// 1. Imports (grouped)
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

// 2. Component definition
const ComponentName = ({ prop1, prop2 }) => {
  // 3. Hooks
  const dispatch = useDispatch();
  const [state, setState] = useState(null);
  
  // 4. Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // 5. Handlers
  const handleClick = () => {
    // Handle event
  };
  
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 7. Export
export default ComponentName;
```

### CSS/Tailwind

```jsx
// ✅ Good: Organized Tailwind classes
<div className="
  flex items-center justify-between
  p-4 rounded-xl
  bg-white/5 backdrop-blur-xl
  border border-purple-500/30
  hover:border-purple-500/50
  transition-all duration-300
">

// ❌ Avoid: Unorganized, hard to read
<div className="flex p-4 border hover:border-purple-500/50 backdrop-blur-xl bg-white/5 items-center rounded-xl transition-all border-purple-500/30 duration-300 justify-between">
```

### Backend Standards

```javascript
// Controllers: Async/await with error handling
const startInterview = async (req, res) => {
  try {
    const { resumeId, preferences } = req.body;
    
    // Validation
    if (!resumeId) {
      return res.status(400).json({ error: 'Resume ID required' });
    }
    
    // Business logic
    const interview = await Interview.create({
      user: req.user.id,
      resume: resumeId,
      preferences
    });
    
    res.status(201).json({ success: true, interview });
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ error: 'Failed to start interview' });
  }
};
```

---

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style (formatting, semicolons) |
| `refactor` | Code refactoring |
| `perf` | Performance improvements |
| `test` | Adding/updating tests |
| `chore` | Maintenance tasks |
| `ci` | CI/CD changes |

### Examples

```bash
# Feature
git commit -m "feat(interview): add voice recording pause functionality"

# Bug fix
git commit -m "fix(auth): resolve token refresh race condition"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Breaking change
git commit -m "feat(api)!: change interview endpoint response format

BREAKING CHANGE: Interview response now includes nested questions array"
```

### Commit Best Practices

- ✅ Write in imperative mood ("add" not "added")
- ✅ Keep subject under 72 characters
- ✅ Reference issues: `fix(auth): resolve login error (#123)`
- ❌ Don't end subject with a period
- ❌ Don't use generic messages like "fix bug"

---

## 🔄 Pull Request Process

### 1. Create a Branch

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Branch Naming

| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/description` | `feature/add-video-interviews` |
| Bug Fix | `fix/description` | `fix/login-token-expiry` |
| Hotfix | `hotfix/description` | `hotfix/critical-auth-bug` |
| Docs | `docs/description` | `docs/api-reference` |

### 2. Make Changes

- Write clean, documented code
- Add/update tests as needed
- Follow coding standards
- Keep commits atomic and focused

### 3. Test Your Changes

```bash
# Run linting
npm run lint

# Run tests
npm test

# Check build
npm run build
```

### 4. Push & Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:

- **Clear title** following commit conventions
- **Description** of what changed and why
- **Screenshots/videos** for UI changes
- **Link to related issue(s)**
- **Checklist** of completed items

### PR Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Screenshots
If applicable, add screenshots.

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] All tests pass locally
```

### 5. Code Review

- Respond to feedback promptly
- Make requested changes
- Re-request review after updates
- Be patient and respectful

### 6. Merge

Once approved:
- Squash and merge for clean history
- Delete your branch after merge

---

## 📋 Issue Guidelines

### Labels

| Label | Description |
|-------|-------------|
| `bug` | Something isn't working |
| `feature` | New feature request |
| `enhancement` | Improvement to existing feature |
| `documentation` | Documentation improvements |
| `good first issue` | Good for newcomers |
| `help wanted` | Extra attention needed |
| `priority: high` | Critical issues |
| `priority: low` | Nice to have |
| `wontfix` | Not planned to fix |

### Issue Lifecycle

1. **Open** — Issue is created
2. **Triaged** — Maintainer reviews and labels
3. **In Progress** — Someone is working on it
4. **Review** — PR submitted
5. **Closed** — Issue resolved

---

## 🌐 Community

### Get Help

- 💬 [Discord Server](https://discord.gg/mockmate) — Real-time chat
- 🐦 [Twitter](https://twitter.com/mockmate_ai) — Updates and announcements
- 📧 [Email](mailto:dwarika.kumar9060@gmail.com) — Direct contact

### Stay Updated

- ⭐ Star the repository
- 👁️ Watch for notifications
- 🍴 Fork to contribute

### Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Our website's contributors page

---

<div align="center">

## 🙏 Thank You!

Every contribution, no matter how small, makes MockMate better.

**Happy Contributing! 🚀**

---

<sub>Questions? Reach out to [team@mockmate.ai](mailto:dwarika.kumar9060@gmail.com)</sub>

</div>
