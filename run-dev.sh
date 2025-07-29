#!/bin/bash

# SmartCard AI Development Server Startup Script

echo "🚀 Starting SmartCard AI Development Servers..."

# Function to kill background processes on exit
cleanup() {
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM

# Start Backend Server
echo "📡 Starting Flask Backend Server..."
cd backend
python app.py &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start Frontend Server
echo "🌐 Starting React Frontend Server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Both servers started successfully!"
echo "📋 Access URLs:"
echo "   • User Portal: http://localhost:5000/user-portal"
echo "   • Admin Portal: http://localhost:5000/admin-portal"
echo "   • Frontend Dev: http://localhost:3000"
echo "   • Backend API: http://localhost:5000/api"
echo ""
echo "🔧 Demo Credentials:"
echo "   • Admin: admin / admin123"
echo "   • User: user / user123"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for background processes
wait
