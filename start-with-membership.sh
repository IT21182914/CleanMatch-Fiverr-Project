#!/bin/bash

# CleanMatch Membership Implementation Test Script
echo "🚀 Starting CleanMatch with Membership Features..."

# Start backend
echo "📡 Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend
echo "🎨 Starting frontend development server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ CleanMatch is running!"
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "🎯 Test the new membership features:"
echo "1. Visit the homepage - you'll see membership CTAs"
echo "2. Click 'Save 50%' in the navbar to test direct signup"
echo "3. Try booking a service to see pricing banners"
echo "4. Register with membership intent"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
wait $FRONTEND_PID
kill $BACKEND_PID
