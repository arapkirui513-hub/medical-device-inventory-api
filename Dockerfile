# Use the official Node.js LTS image
FROM node:22-alpine

# Create the application directory
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install production dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the application port
EXPOSE 3000

# Start the API
CMD ["npm", "start"]