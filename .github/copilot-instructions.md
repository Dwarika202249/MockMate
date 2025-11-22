# MockMate AI Coding Guidelines

## Project Overview
MockMate is a hybrid AI interview preparation application with intelligent 2-tier failover:
- Tier 1: Groq API (free cloud AI) for question generation & evaluation
- Tier 2: Pre-stored question dataset as guaranteed fallback
- Local heuristic evaluation for instant feedback
- Analytics-ready data structures with privacy controls
- Realtime WebSocket communication for smooth UX

### Tech Stack
- Frontend: React + Vite with TailwindCSS
- State Management: Redux Toolkit
- Backend: Express.js API with MongoDB
- Infrastructure: BullMQ/Redis for job queues, WebSocket for realtime updates
- AI: 2-Tier Failover (Groq → Pre-stored)

## Architecture & Key Flows

### Core Interview Flow
1. Resume Collection & Setup
   - File upload or text input with privacy consent
   - Mic/camera permissions for STT/TTS
   - Initial question generation via 2-tier failover

2. Question-Answer Loop
   - TTS question playback
   - STT recording with silence detection
   - Instant local heuristic feedback
   - Async deep AI evaluation via failover chain

3. Feedback Generation
   - Per-answer scores and feedback
   - Final interview summary
   - Analytics and recommendations

### Backend Architecture
- Express server with RESTful API endpoints
- Worker queue for async AI operations
- WebSocket server for realtime updates
- 2-Tier AI Provider System (aiProvider.js)
- Key models:
  ```js
  Interview: {
    user: ObjectId,
    resume: ObjectId,
    status: String,
    questions: [{ id, text, type, difficulty, expectedKeywords }],
    answers: [{ questionId, text, feedback, timestamp }],
    preferences: Object,
    summary: Object
  }

  Resume: {
    user: ObjectId,
    jobRole: String,
    summary: String,
    skills: Array,
    experience: Array,
    education: Array
  }
  ```

### Frontend Structure
- Feature-based directory organization
- WebSocket-first with polling fallback
- TTS/STT integration via Web Speech API
- Protected/public route separation

## Core Patterns & Systems

### 2-Tier AI Failover System
**File:** `backend/utils/aiProvider.js`

**Tier 1: Groq API (Cloud)**
- Endpoint: https://api.groq.com/openai/v1/chat/completions
- Model: mixtral-8x7b-32768
- Speed: 2-5 seconds
- Cost: FREE (with rate limits)
- Uses: Question generation & answer evaluation

**Tier 2: Pre-stored Dataset (Instant)**
- Location: Embedded in aiProvider.js
- Roles: Frontend Engineer, Backend Engineer, Full Stack Developer
- Questions per role: 5
- Speed: <1ms
- Cost: FREE

**Failover Logic:**
```javascript
generateQuestionsWithFailover(resumeText, role, numQuestions)
├─ Try Tier 1: Groq API (15s timeout)
└─ On fail: Use Tier 2: Pre-stored Dataset (instant)
└─ On fail: Use Tier 3: Pre-stored (instant)
```

### Question Generation Flow
- **Input:** Resume text, job role, number of questions
- **Processing:** All tiers return raw JSON arrays
- **Formatting:** Single point in interviewHandlers.js
- **Output:** Array of `{id, text, type, difficulty, expectedKeywords}`

### Answer Evaluation Flow
- **Input:** Question object, answer text, preferences
- **Local Heuristics:** Instant keyword + length scoring
- **AI Evaluation:** Via 2-tier failover (Groq/Local)
- **Output:** `{score, label, strengths, improvements, feedback}`

### WebSocket Events
- `INITIALIZE_INTERVIEW`: Start interview, generate questions
- `QUESTIONS_READY`: Questions available for display
- `SUBMIT_ANSWER`: User submits answer for evaluation
- `ANSWER_EVALUATED`: Evaluation complete, feedback sent
- `NEXT_QUESTION`: Move to next question
- `INTERVIEW_COMPLETED`: Final summary generated
- `ERROR`: Any error in flow

## Prompt Engineering & AI Integration

### Question Generation Prompt
```
You are an expert interviewer for a [role] position. 
Generate exactly [numQuestions] technical interview questions.

Resume Summary: [resumeText]

Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": "q1",
    "text": "Question text?",
    "type": "Technical",
    "difficulty": "medium",
    "expectedKeywords": ["keyword1", "keyword2"],
    "order": 1
  }
]
```

### Answer Evaluation Prompt
```
You are an expert interviewer evaluating an answer.

Question: [question.text]
Expected Keywords: [question.expectedKeywords]
Answer: [userAnswer]

Return ONLY JSON:
{
  "score": 0-100,
  "label": "Poor|OK|Good|Excellent",
  "strengths": ["strength1"],
  "improvements": ["improvement1"],
  "feedback": "feedback text"
}
```

### Critical: Data Flow
1. **Question Generation**
   - All tiers return: `Array<{id, text, type, difficulty, expectedKeywords}>`
   - Single formatting point in interviewHandlers.js
   - Deep copy before MongoDB save: `JSON.parse(JSON.stringify(formatted))`

2. **Answer Evaluation**
   - Local heuristic first (instant)
   - Async AI via failover chain
   - Merged results sent to frontend

3. **MongoDB Schema**
   - Questions: `[{id: String, text: String, type: String, difficulty: String, expectedKeywords: [String]}]`
   - Answers: `[{questionId: String, text: String, feedback: Object, timestamp: Date}]`

## API Contracts

### Core Endpoints
- `POST /api/interview/start`: Start new interview session
- `POST /api/interview/:id/answer`: Submit answer & trigger evaluation
- `GET /api/interview/:id`: Get full interview state
- `POST /api/interview/:id/end`: End interview & generate summary

### Worker Jobs
- `generate-initial-questions`: Batch question generation
- `evaluate-answer`: Deep feedback with Gemini
- `generate-summary`: Final interview analysis

## Development Setup

### Backend Environment
```bash
cd backend
npm install
# Required in .env:
# - MONGO_URI
# - GEMINI_API_KEY
# - REDIS_URL
npm start
```

### Frontend Environment
```bash
cd frontend
npm install
# Required in .env:
# - VITE_API_URL
# - VITE_GOOGLE_CLIENT_ID
# - VITE_WS_URL
npm run dev
```

## Testing & Quality

### Quick Verification (Post-Restart)
```bash
cd backend
npm start                                    # Terminal 1: Start backend
node tests/testQuestionFlow.js               # Terminal 2: Run diagnostic test
```

Expected Output:
```
✅ MongoDB connected
✅ Tier 1 (Groq) test generation...
✅ Tier 2 (Pre-stored) test generation...
✅ All questions are objects (not strings)
✅ ALL TESTS PASSED
```

### Unit Tests
- Answer evaluator utilities
- Prompt builders & JSON parsers
- WebSocket event handlers
- 2-tier failover logic

### Integration Tests
- Full interview flow (resume → questions → answers → feedback)
- Worker queue processing
- Real-time feedback delivery
- MongoDB validation (questions must be objects, not strings)

### Best Practices
1. Use strict JSON schemas for AI responses
2. Implement proper error boundaries & fallbacks 
3. Track token usage & implement rate limits
4. Follow privacy-first data handling
5. Cache aggressively to reduce API costs
6. Always deep-copy before MongoDB save: `JSON.parse(JSON.stringify())`
7. Single formatting point for data transformation
8. Validate array types before assignment