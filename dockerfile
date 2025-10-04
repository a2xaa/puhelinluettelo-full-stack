FROM node:20

WORKDIR /app

# Copy everything
COPY . .

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm install

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Expose the backend port (adjust if not 8080)
EXPOSE 8080

# Start the backend server
CMD ["npm", "start"]
# Or if you prefer:
# CMD ["node", "index.js"]
