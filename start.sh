#!/bin/bash

set -e

echo "=============================================="
echo "  AI Urban Planning & Zoning Simulator"
echo "  Starting Application..."
echo "=============================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Load env
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

BACKEND_PORT=${PORT:-4000}
CLIENT_PORT=${CLIENT_PORT:-3000}

# Kill processes on ports
echo -e "${YELLOW}Cleaning up ports ${BACKEND_PORT} and ${CLIENT_PORT}...${NC}"
lsof -ti:${BACKEND_PORT} 2>/dev/null | xargs kill -9 2>/dev/null || true
lsof -ti:${CLIENT_PORT} 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1

# Check PostgreSQL
echo -e "${BLUE}Checking PostgreSQL...${NC}"
if ! command -v psql &> /dev/null; then
  echo -e "${RED}PostgreSQL is not installed. Please install it first.${NC}"
  exit 1
fi

if ! pg_isready -q 2>/dev/null; then
  echo -e "${YELLOW}Starting PostgreSQL...${NC}"
  if [[ "$OSTYPE" == "darwin"* ]]; then
    brew services start postgresql@14 2>/dev/null || brew services start postgresql 2>/dev/null || true
  else
    sudo systemctl start postgresql 2>/dev/null || true
  fi
  sleep 2
fi

# Create database if not exists
echo -e "${BLUE}Setting up database...${NC}"
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'urban_planning'" 2>/dev/null | grep -q 1 || \
  createdb -U postgres urban_planning 2>/dev/null || \
  psql -tc "SELECT 1 FROM pg_database WHERE datname = 'urban_planning'" 2>/dev/null | grep -q 1 || \
  createdb urban_planning 2>/dev/null || true

# Install dependencies
echo -e "${BLUE}Installing backend dependencies...${NC}"
npm install

echo -e "${BLUE}Installing frontend dependencies...${NC}"
cd client && npm install && cd ..

# Seed database
echo -e "${GREEN}Seeding database...${NC}"
node server/seed.js

# Start application with hot reload
echo -e "${GREEN}=============================================="
echo -e "  Starting servers with hot reload..."
echo -e "  Backend:  http://localhost:${BACKEND_PORT}"
echo -e "  Frontend: http://localhost:${CLIENT_PORT}"
echo -e "==============================================${NC}"

npx concurrently \
  --names "SERVER,CLIENT" \
  --prefix-colors "blue,green" \
  "npx nodemon --watch server server/index.js" \
  "cd client && PORT=${CLIENT_PORT} npx react-scripts start"
