# MockMate AI Coding Guidelines

## Project Overview
MockMate is a hybrid AI interview preparation application that combines:
- Local heuristic evaluation for instant feedback
- Selective Gemini API calls for deep feedback and adaptive questions
- Analytics-ready data structures with privacy controls
- Realtime WebSocket communication for smooth UX

### Tech Stack
- Frontend: React + Vite with TailwindCSS
- State Management: Redux Toolkit
- Backend: Express.js API with MongoDB
- Infrastructure: BullMQ/Redis for job queues, WebSocket for realtime updates
- AI: Hybrid local/Gemini evaluation system

## Architecture & Key Flows

### Core Interview Flow
1. Resume Collection & Setup
   - File upload or text input with privacy consent
   - Mic/camera permissions for STT/TTS
   - Initial question generation (cached Gemini call)

2. Question-Answer Loop
   - TTS question playback
   - STT recording with silence detection
   - Instant local heuristic feedback
   - Async deep AI evaluation via worker queue

3. Feedback Generation
   - Per-answer scores and feedback
   - Final interview summary
   - Analytics and recommendations

### Backend Architecture
- Express server with RESTful API endpoints
- Worker queue for async AI operations
- WebSocket server for realtime updates
- Key models:
  ```js
  Interview: {
    user: ObjectId,
    type: String,
    resumeSnapshot: Object,
    status: String,
    numQuestions: Number
  }

  Answer: {
    interview: ObjectId,
    transcript: String,
    heuristicScore: Number,
    geminiFeedback: Object
  }

  FeedbackSummary: {
    interview: ObjectId,
    overallScore: Number,
    perTopicScores: Array,
    tokenUsage: Object
  }
  ```

### Frontend Structure
- Feature-based directory organization
- WebSocket-first with polling fallback
- TTS/STT integration via Web Speech API
- Protected/public route separation

## Core Patterns & Systems

### AI Evaluation Strategy
1. Local Heuristics (Instant)
   - Keyword matching
   - Length scoring
   - Filler word detection
   - Used for immediate feedback

2. Gemini Integration (Async)
   - Selective calls based on heuristic scores
   - Strict JSON output format
   - Caching with resumeHash keys
   - Token usage tracking

### WebSocket Events
- `QUESTIONS_READY`: Initial questions available
- `GEMINI_FEEDBACK`: Deep feedback completed
- `NEXT_QUESTION`: New question generated
- `JOB_STATUS`: Worker progress updates

## Prompt Engineering & AI Integration

### Question Generation
```json
{
  "system": "You are an expert interviewer for {role}",
  "output_schema": "array of { id, text, difficulty, topic, expected_keywords }",
  "context": {
    "resume_text": "...",
    "previous_answers": "..."
  }
}
```

### Answer Evaluation
```json
{
  "system": "Expert interviewer and scorer",
  "input": {
    "question": "...",
    "transcript": "...",
    "resume_context": "..."
  },
  "output_schema": {
    "schemaVersion": "1.0",
    "score": "0-100",
    "label": "Poor|OK|Good|Excellent",
    "strengths": ["..."],
    "improvements": ["..."],
    "nextQuestion": {"text": "...", "expected_keywords": [...]}
  }
}
```

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

### Unit Tests
- Answer evaluator utilities
- Prompt builders & JSON parsers
- WebSocket event handlers

### Integration Tests
- Full interview flow
- Worker queue processing
- Real-time feedback delivery

### Best Practices
1. Use strict JSON schemas for AI responses
2. Implement proper error boundaries & fallbacks 
3. Track token usage & implement rate limits
4. Follow privacy-first data handling
5. Cache aggressively to reduce API costs