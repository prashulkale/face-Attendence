
FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with a clean cache
RUN npm install
COPY . .

# Application port
ENV PORT=3000

EXPOSE 3000

# Start the app
CMD ["node", "index.js"]