
#!/bin/bash

echo "Starting Data Analysis Platform..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Start backend
echo "Starting FastAPI backend..."
cd backend
if command_exists python3; then
    python3 -m venv venv 2>/dev/null
    source venv/bin/activate
    pip install -r requirements.txt >/dev/null 2>&1
    python3 main.py &
else
    echo "Python 3 not found. Please install Python 3."
    exit 1
fi

BACKEND_PID=$!
cd ..

# Start frontend
echo "Starting React frontend..."
if command_exists npm; then
    npm install >/dev/null 2>&1
    npm run dev &
    FRONTEND_PID=$!
elif command_exists bun; then
    bun install >/dev/null 2>&1
    bun run dev &
    FRONTEND_PID=$!
else
    echo "Neither npm nor bun found. Please install Node.js or Bun."
    kill $BACKEND_PID
    exit 1
fi

echo ""
echo "🚀 Data Analysis Platform is starting..."
echo "📊 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:8000"
echo "📖 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap 'echo "Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID; exit' INT
wait
