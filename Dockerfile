FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Expose the port Next.js will run on
EXPOSE 3000

# Start the dev server
CMD ["npm", "run", "dev"]
