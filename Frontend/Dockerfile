FROM node:14 as builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

RUN npm install styled-components


# Build the application
RUN npm run build



# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory
WORKDIR /app

RUN npm install -g serve

# Expose the port for the application to run on
EXPOSE 3000

# Copy the build files from the builder image
COPY --from=builder /app/build .

# Start the application
CMD ["serve", "-s", "."]