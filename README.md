# SIMBI APP
This is the backend service for a SIMBI application, built with TypeScript, Express, and Mongoose. It provides APIs for user authentication, managing study plans through custom AI generated and user generated, recording study sessions, study note, study resources, quiz generation, quiz attempts, quiz history, tracking user streaks based on daily activity, telegram bot for nft and token rewards, nft wallet.

## Features

* User Authentication: Register new users and authenticate existing ones using JWT.
* AIPlan: Custom AI generation of study plan and quiz based on the user.
* Study Plan Management: Create, retrieve, update, and delete study plans for users.
* Study Session Tracking: Record study sessions linked to specific study plans, including duration and completion status.
* Quiz Management: Create quizzes associated with study plans, including questions and answers.
* Quiz Attempt Tracking: Record user attempts for quizzes, including score and a "progress" status.
* Quiz History Tracking: Record user quiz history and repeat of the quiz in the near future.
* Study Note: Take notes for during study sessions.
* Study Resource: Track users resource upload during study session.
* Wallet Service: Track users NFT tokens based on the achievements on the app.
* Daily Streak: Tracks consecutive days a user performs a streak-eligible action.
* Longest Streak: Records the user's highest achieved consecutive streak.
* Streak Triggers: The streak is updated upon:
    * Successful User Login.
    * Completing a Study Session.
    * Passing a Quiz Attempt.
* API Documentation: Interactive API documentation provided via Swagger UI.
* TypeScript Implementation: Fully typed application with interfaces and type-safety.
* MongoDB Integration: Persistent storage using Mongoose ODM.
* RESTful API Design: Clean, consistent endpoint structure.
* Error Handling: Custom error classes with appropriate HTTP status codes.

## Technologies Used

* TypeScript: Adds static typing to JavaScript for better code maintainability and scalability.
* Node.js: JavaScript runtime environment.
* Express.js: Fast, unopinionated, minimalist web framework for Node.js.
* Mongoose: MongoDB object data modeling (ODM) library for Node.js.
* MongoDB: NoSQL document database.
* JSON Web Tokens (JWT): Secure method for transmitting information between parties as a JSON object, used for authentication.
* bcrypt: Library for hashing passwords securely.
* dotenv: Loads environment variables from a .env file.
* date-fns: Modern JavaScript date utility library.
* swagger-jsdoc: A library for generating Swagger/OpenAPI documentation from JSDoc comments.
* swagger-ui-express & swagger-jsdoc: For generating and serving OpenAPI (Swagger) documentation from JSDoc comments.
* nodemon: Utility that monitors for changes in your source and automatically restarts your server (for development).
* google/generative-ai: A library for working with Google's generative AI models.
* axios: A popular HTTP client library for making requests.
* cors: A library for enabling Cross-Origin Resource Sharing (CORS) in Express.js.
* ethers: A library for working with Ethereum and other blockchain technologies.
* multer: A library for handling multipart/form-data requests (file uploads).
* node-cron: A library for scheduling tasks using cron-like syntax.
* nodemailer: A library for sending emails from Node.js.
* openai: A library for working with OpenAI's API.
* pdf-parse: A library for parsing PDF files.
* zod: A library for validating and parsing data using a schema-based approach.

## Deployment

This API has been **deployed on Render** and is accessible at:`https://simbi-ai.onrender.com/`

🚀 **Base URL:** `https://simbi-ai.onrender.com/api-docs/`


## Project Structure

The codebase follows a layered architecture:

```
/SIMBI
├── dist/ 
├── node_modules/         # Project dependencies
├── src/
│   ├── config/           # Configuration files (database connection, swagger config, NFT integration, smart contract configuration, nft metadata)
│   │   ├── abi/ 
│   │   │   └── studyAchievements.ABI.json  # Handles contract ABI for NFT integration
│   │   ├── database/  
│   │   │   └── index.ts     # Mongoose database connection setup
│   │   ├── contract.config.ts # Handles smart contract configuration
│   │   ├── ethers.ts # Handles token configuration
│   │   ├── geminiquiz.ts # Simbi quiz AI-powered generation setup
│   │   ├── nftMetadataMap.ts # Handles NFT metadata
│   │   └── swagger.ts     # Swagger JSDoc configuration
│   ├── controllers/      # Handle incoming HTTP requests, call services, send responses
│   │   ├── aiPlan.controller.ts # Handles user AI-powered study plan generation
│   │   ├── auth.controller.ts  # Handles user registration and login
│   │   ├── quiz.controller.ts   # Handles quiz and quiz attempt requests
│   │   ├── quizHistory.controller.ts # Handles the users quiz attempt history
│   │   ├── studyNote.controller.ts # Handles note taking during study sessions
│   │   ├── studyPlan.controller.ts #  Handles study plan requests
│   │   ├── studyResource.controller.ts # Handles study resource upload during study session
│   │   ├── studySession.controller.ts # Handles study sessions flow
│   │   └── user.controller.ts # Handles users token
│   ├── interfaces 
│   │   ├── auth.interface.ts  # Handles the blueprint of objects in the simbi app 
│   │   ├── express.d.ts  # Handles the type declaration for the Express.js framework 
│   │   ├── quiz.types.ts      # Handle the blueprint of objects that input data for a quiz
│   │   └── quizHistory.types.ts  # Handle the blueprint of objects that input data for a quizHistory
│   ├── middleware/       # Express middleware (e.g., authentication)
│   │   ├── auth.middleware.ts # JWT authentication middleware
│   │   ├── error.middleware.ts # Error handling middleware
│   │   └── queryOpenai.middleware.ts # Handles AI query
│   ├── models/           # Define Mongoose schemas and models for MongoDB
│   │   ├── achievement.model.ts  # Mongoose model for achievements
│   │   ├── quiz.model.ts # Mongoose model for Quizzes
│   │   ├── studyNote.model.ts  # Mongoose model for study note 
│   │   ├── studyResource.model.ts  # Mongoose model for resources
│   │   ├── studyPlan.ts # Mongoose model for Study Plans
│   │   └── user.ts     # Mongoose model for user-specific actions (e.g., /me)
│   ├── routes/           # Define API endpoints and link to controllers
│   │   ├── aiPlan.route.ts # Routes for ask-simbi AI
│   │   ├── auth.route.ts # Routes for authentication (register, login)
│   │   ├── quiz.route.ts # Routes for quiz
│   │   ├── quizHistory.routes.ts  # Routes for quiz attempts history
│   │   ├── studyNote.route.ts  # Routes for study notes
│   │   ├── studyPlans.route.ts  # Routes for study plans
│   │   ├── studyResource.route.ts  # Routes for the study resources 
│   │   ├── studySession.route.ts  # Routes for the study sessions 
│   │   └── user.routes.ts  # Routes for the user
│   ├── services/         # Contains business logic, interacts with models
│   │   ├── achievement.service.ts  # Business logic for the achievement
│   │   ├── aiPlan.service.ts # Business logic for ask-simbi AI
│   │   ├── auth.service.ts # Business logic for primary streak trigger
│   │   ├── nft.service.ts  # Business logic for the NFT
│   │   ├── quiz.service.ts # Business logic for quizzes
│   │   ├── quizHistory.service.ts # Business logic for quiz attempts 
│   │   ├── studyNote.service.ts  # Business logic for the study note
│   │   ├── studyPlan.service.ts # Business logic for study plans
│   │   ├── studyResource.service.ts  # Business logic for the study resources 
│   │   ├── studySession.service.ts  # Business logic for the study sessions 
│   │   ├── tokenService.ts  # Business logic for the token
│   │   └── walletService.ts # Business logic for wallet service to collect achievements
│   ├── types
│   │   ├── pdf-parse.d.ts # Handles the extracted data from PDF files
│   │   └── types.d.ts     # Handles the blueprint for object that represents a User 
│   ├── utils/            # Helper functions
│   │   └── streak.utils.ts # Logic for calculating and updating streaks
│   ├── validators
│   │   └── quiz.validator.ts # Handles quiz validations using zod 
│   ├── app.ts            # Express application setup (middleware, route registration, swagger setup)
│   └── server.ts         # Application entry point (connects to DB, starts server)
├── uploads
│    └── 174295116946-maths.pdf # Handles resource upload during study sessions
├── .env                  # Environment variables (copy from .env.example and fill in)
├── .gitignore            # Specifies intentionally untracked files for Git
├── next.config.js.       # Handles customized aspects of our app
├── package-lock.json     # Locks the versions of dependencies and their dependencies, ensuring the project is reproducible
├── package-schema.json   # Handles schema definition of package.json and other configuration files
├── package.json          # Project dependencies and scripts
├── Procfile              # Specify the commands the are executed by the project
├── README.md             # Project documentation
├── tsconfig.json         # TypeScript compiler configuration
└── tsconfig.tsbuildinfo  # TypeScript compiler generated and contains information about the build process
 ```

``
## Getting Started
``
### Prerequisites

* Node.js (v18 or higher recommended)
* npm or yarn package manager
* MongoDB database (local or hosted)

### Installation

1.  Clone the repository:
   
    git clone <repository_url>
    cd SIMBI
    
2.  Install dependencies:
   
    npm install
    # or
    # yarn install
  ```  
### Environment Variables

1.  Create a .env file in the root directory of the project.
2.  Copy the content from the (optional) .env.example file and fill in your database connection string and a JWT secret.

   
    # .env example
    DATABASE_URL="mongodb://<user>:<password>@<host>:<port>/<database>" # Replace with your MongoDB connection string
    JWT_SECRET="a_very_secure_simbi_secret_for_jwt_signing"         # CHANGE THIS TO A STRONG, UNIQUE SECRET
    PORT=3000                                                        # Port for the server to listen on
    ENCRYPTION_KEY=my_encryption-key
    EMAIL_USER=nellg.gc@gmail.com
    EMAIL_PASS= email-pass-key
    GEMINI_API_KEY=api-key
    OPENROUTER_API_KEY=open_router-api-key
    
### Database Setup

Ensure your MongoDB database is running and accessible via the DATABASE_URL provided in your .env file. Mongoose will automatically create the collections (like users, studyplans, studysessions, quiz, quizHistory) when you save documents to them for the first time based on the defined models.

### Running the Server

* Development Mode (with nodemon and TypeScript compilation):
   
    npm run dev
    
    This will compile your TypeScript code and start the server. Nodemon will watch for file changes and automatically restart the server.

* Production Mode (build and run):
   
    npm run build
    
    This compiles the TypeScript code into the dist directory.

   
    npm start
    
    This runs the compiled JavaScript code from the dist directory.

## API Endpoints

The API is served at the base URL configured in your .env file (default: http://localhost:3000). All API routes are prefixed with /api.

Refer to the Swagger API Documentation for a detailed list of available endpoints, request/response schemas, and how to interact with them.

###  AIPlan 

* POST /api/ai/ask-simbi": Generate a personalized AI study plan

### Authentication

* POST /api/auth/register: Register a new user.
* POST /api/auth/login: Log in an existing user (updates streak).

### Quizzes

* POST /api/quiz/generate: Generate a new quiz.
* POST /api/:quizId/answer: Submit an answer for a quiz question
* GET /api/:quizId: Get a specific quiz by ID .
* GET /api/:quizId/progress: Get quiz progress
* GET /api/:quizId/score: Get quiz score
* POST /api/:quizId/retake: Retake a quiz

### Quiz History

* GET /api/history: Record a user's quiz attempt (updates streak if passed) (requires JWT).
* GET /api/history/:quizId: Get user's attempts for a specific quiz (requires JWT).

### Study Notes

* POST /api/studyNotes/: Create a note for a study session
* PUT /api/studyNotes/:id: Update a note by ID
* DELETE /api/studyNotes/:id:  Delete a note by ID
* GET /api/studyNotes/:sessionId: Get all notes for a specific study session

### Study Plans

* POST /api/sessions: Create and record a new study plan and session (update streak).
* GET /api/sessions: Get all study session for the user .
* GET /api/sessions/:id: Get a specific study session by ID .
* PUT /api/sessions/:id: Updates a specific study session by ID.
* DELETE /api/sessions/:id: Deletes a specific study session by ID.

### Study Resources

* POST /api/studyResources/: Upload a study resource for a session
* GET /api/studyResources/:sessionId: Get all uploaded resources for a study session

### Study Session

* POST /api/studySessions/start/:sessionId: Start an existing study session
* POST /api/studySessions/pause/:sessionId: Pause an active study session
* POST /api/studySessions/resume/:sessionId: Resume a paused study session
* POST /api/studySessions/complete/:sessionId: Complete a study session

### User 

* GET /api/user/balance: Retrieved token balance

## Streak Tracking Details

The daily streak is a core feature encouraging consistent engagement.

* How it's tracked: Each User document in the database has currentStreak, longestStreak, and lastStudyDate fields. lastStudyDate stores the timestamp of the last action that counted towards the streak.
* How it's updated: The updateStreak function in src/utils/streak.utils.ts calculates the new streak values by comparing the current day to lastStudyDate.
* When it's triggered: The updateUserLastStudyDate function in src/services/user.service.ts calls updateStreak and saves the result to the database. This service function is called from:
    * The login controller (auth.controller.ts) upon successful login.
    * The createStudyPlan service (studyPlan.service.ts) after a study plan is saved.
    * The recordQuizAttempts service (quiz.service.ts) if the quiz attempt is marked as "passed".
* Daily Window: The streak logic considers a "day" from midnight to midnight based on the server's local time (or potentially timezone-aware if you enhance the date-fns usage with timezones, which date-fns-tz supports). Performing a streak-eligible action any time within a 24-hour calendar day (starting from midnight) will count for that day. Subsequent actions on the same day will not increment the streak further for that day.

## API Documentation (Swagger UI)

Interactive API documentation is available once the server is running.

1.  Start the server (npm run dev or npm start).
2.  Open your web browser and navigate to:
   
    `http://localhost:3000/api-docs`
    
    (Replace 3000 if you configured a different port in your .env file).

This interface allows you to explore all endpoints, view request/response schemas, and even test the API directly.

## Contributing

1.  Clone the repository:
   ```bash
    git clone <repository_url>
    cd SIMBI
    ```

2.  Install dependencies:
   ```bash
    npm install
    or 
    npm i
    ```
 
 3. Create a `.env` file in the root directory with the following variables:
     PORT= your port
     MONGO_URI=database url
     ENCRYPTION_KEY=encryption key
     JWT_SECRET=jwt secret
     EMAIL_USER=email
     EMAIL_PASS=email-pass-key
     GEMINI_API_KEY= your-api-key
     OPENROUTER_API_KEY= your-router-api-key

    
## License

[ISC]