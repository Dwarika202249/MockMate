# MockMate

**MockMate** is an AI-driven mock interview platform designed to help users prepare for interviews by providing real-time feedback, practice sessions, and more. The application uses advanced AI to simulate interview scenarios, allowing users to refine their skills and build confidence.

## Features

- **AI-Driven Interviews**: Generate interview questions and receive AI-based feedback on your answers.
- **Voice and Video Integration**: Conduct interviews with voice answers and video recording for a more immersive experience.
- **Resume-Based Interviewing**: Upload your resume and get a full-fledged interview based on your resume.
- **Interview History**: Track your progress with a detailed history of past interviews and feedback.
- **Practice Mode**: Practice specific types of questions or interviews to focus on your weak areas.
- **Responsive Design**: Fully responsive design optimized for both desktop and mobile devices.
- **User Authentication**: Google login and Secure user authentication with JWT tokens.
- **Dynamic Dashboard**: Personalized user dashboard with progress tracking and notifications.

## Future Features

- **AI-Powered Analytics**: Insights and analytics on user performance over time.
- **Custom Interview Templates**: Users can create and share custom interview question sets.
- **Advanced Reporting**: Detailed reporting and analytics for users to track improvements.
- **Live Interview Mode**: Real-time interviews with AI interviewers.
- **Integration with Job Portals**: Sync with job portals for real-time job application tracking and interview preparation.
- **Community and Sharing**: Share interview experiences and feedback with other users in the community.

## Tech Stack

### Frontend

- **React**: JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **Vite**: Next-generation frontend tool for faster builds.
- **Framer Motion**: Library for creating animations in React.

### Backend

- **Node.js**: JavaScript runtime built on Chrome's V8 engine.
- **Express.js**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for storing interview data.
- **Mongoose**: ODM for MongoDB, providing schema-based solutions.

### AI Integration

- **Google Generative AI**: Used for generating interview questions and analyzing user responses.
- **Gemini AI API**: Handles question generation, response analysis, and feedback.

## Project Structure

### Frontend

- **frontend/src/components**: Reusable React components.
- **frontend/src/pages**: Page-level components and routing logic.
- **frontend/src**: Main entry points and styles.

### Backend

- **backend/controllers**: Contains controller functions for handling requests.
- **backend/models**: Mongoose models for the MongoDB collections.
- **backend/routes**: Defines API endpoints.
- **backend/config**: Configuration files, such as the database connection.
- **backend/middleware**: Custom middleware functions, including authentication.

## API Endpoints

### User Authentication

- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Log in an existing user.
- **POST** `/api/auth/google`: Log in and Register using Gmail

### Interview Management

- **POST** `/api/interviews`: Create a new interview session.
- **GET** `/api/interviews/:id`: Get interview details by ID.
- **GET** `/api/interviews/user/:userId`: Get all interviews for a specific user.

### Feedback and History

- **GET** `/api/feedback/:interviewId`: Get feedback for a specific interview.
- **GET** `/api/history/:userId`: Get the interview history for a specific user.

## Environment Variables

The following environment variables need to be set in your `.env` file in the `backend` directory:

- **`PORT`**: The port on which the server will run.
- **`MONGODB_URI`**: The MongoDB connection string.
- **`JWT_SECRET`**: A secret key for signing JWT tokens.
- **`GEMINI_API_KEY`**: API key for the Gemini AI service.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature-branch-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add new feature'`).
5.  Push to the branch (`git push origin feature-branch-name`).
6.  Open a Pull Request.

<!-- ## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. -->

## Acknowledgments

- Thanks to the open-source community for the tools and libraries used in this project.

## Thanks
- Dwarika Kumar (Aspiring Full Stack Developer)
