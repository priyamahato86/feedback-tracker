# Feedback Tracker with AI Assistant

A modern, full-stack feedback management application with AI-powered assistance. Built with React, TypeScript, Node.js, and OpenAI integration.

## 🚀 Features

### Frontend Features
- **Modern React Interface**: Built with TypeScript and Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates**: Dynamic feedback management with instant status updates
- **Beautiful UI**: Glass-morphism design with smooth animations and micro-interactions
- **Multiple Feedback Types**: Support for bugs, features, complaints, and general feedback

### Backend Features
- **RESTful API**: Complete CRUD operations for feedback management
- **File-based Storage**: Simple JSON-based data persistence
- **AI Integration**: OpenAI GPT-3.5-turbo powered chat assistant
- **Error Handling**: Comprehensive error handling and validation
- **CORS Support**: Properly configured for frontend-backend communication

### AI Assistant
- **Natural Language Processing**: Powered by OpenAI's GPT-3.5-turbo
- **Context-Aware**: Understands feedback management and customer service queries
- **Real-time Chat**: Instant responses with typing indicators
- **Error Resilience**: Graceful handling of API failures

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API communication
- **Vite** for development and building

### Backend
- **Node.js** with Express
- **File System** for data storage
- **OpenAI API** for AI chat functionality
- **CORS** for cross-origin requests
- **Dotenv** for environment variables

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **OpenAI API Key** (for AI chat functionality)

## ⚡ Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository (if needed)
git clone <repository-url>
cd feedback-tracker-ai

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit the `.env` file and add your OpenAI API key:

```env
# GEMINI API Key - Get yours at https://platform.openai.com/api-keys
GEMINI_API_KEY=your_openai_api_key_here

# Server Port (optional)
PORT=3001
```

### 3. Run the Application

The application uses concurrent processes for both frontend and backend:

```bash
# Start both frontend and backend
npm run dev
```

This will start:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:3001 (Express server)

### Alternative: Run Separately

If you prefer to run them separately:

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run client
```

## 🔧 Development Scripts

```bash
# Start both frontend and backend
npm run dev

# Start only frontend (Vite)
npm run client

# Start only backend (Express)
npm run server

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📁 Project Structure

```
feedback-tracker-ai/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   │   ├── FeedbackForm.tsx    # Feedback submission form
│   │   ├── FeedbackList.tsx    # Feedback management interface
│   │   └── AIChat.tsx          # AI chat assistant
│   ├── services/               # API service layer
│   │   └── api.ts             # Axios API configuration
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts          # Shared interfaces
│   ├── App.tsx               # Main application component
│   └── main.tsx             # Application entry point
├── server/                   # Backend source code
│   ├── data/                # Data storage directory
│   │   └── feedback.json   # Feedback data file
│   └── index.js            # Express server
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

## 🔌 API Endpoints

### Feedback Management
- `GET /api/feedback` - Get all feedback
- `POST /api/feedback` - Create new feedback
- `PUT /api/feedback/:id` - Update feedback status
- `DELETE /api/feedback/:id` - Delete feedback

### AI Chat
- `POST /api/chat` - Send message to AI assistant

## 🎨 UI Components

### FeedbackForm
- Multi-type feedback submission (Bug, Feature, General, Complaint)
- Form validation and error handling
- Beautiful animations and transitions

### FeedbackList
- Real-time feedback management
- Status updates (Pending → Reviewed → Resolved)
- Delete functionality with confirmation
- Responsive card-based layout

### AIChat
- Real-time chat interface
- Message history
- Typing indicators
- Error handling for API failures

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your OpenAI API key for chat functionality | Yes |
| `PORT` | Backend server port (default: 3001) | No |

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` directory with optimized frontend assets.

### Deploy Backend

The backend can be deployed to any Node.js hosting service:

1. **Heroku**: Push to Heroku with environment variables
2. **Railway**: Connect repository with automatic deployments
3. **DigitalOcean**: Deploy to App Platform or Droplet
4. **AWS**: Use Elastic Beanstalk or EC2

### Deploy Frontend

The frontend can be deployed to static hosting services:

1. **Netlify**: Drag and drop the `dist/` folder
2. **Vercel**: Connect GitHub repository
3. **AWS S3**: Upload to S3 bucket with static hosting
4. **GitHub Pages**: Use GitHub Actions for deployment

## 🔍 Troubleshooting

### Common Issues

1. **AI Chat not working**
   - Verify `GEMINI_API_KEY` is set in `.env`
   - Check OpenAI account has credits
   - Ensure backend server is running

2. **Frontend can't connect to backend**
   - Verify backend is running on port 3001
   - Check CORS configuration
   - Ensure API base URL is correct

3. **Build errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check Node.js version (16+ required)
   - Clear node_modules and reinstall if needed

### Getting OpenAI API Key

1. Visit [GEMINI Platform](https://platform.gemini.com/api-keys)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new secret key
5. Copy and paste into your `.env` file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋‍♂️ Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the project's GitHub issues
3. Create a new issue with detailed information

---

Built with ❤️ using React, TypeScript, Node.js, and GEMINI