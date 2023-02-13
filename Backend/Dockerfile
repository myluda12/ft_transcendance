
# Use an official Node.js runtime as the base image
FROM node:14 as builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build


# Use an official Node.js runtime as the base image
FROM node:14


# Set the working directory
WORKDIR /app
ADD ./prisma ./prisma
ADD ./script.sh /app/start.sh
RUN npm install -g prisma
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules



# ENTRYPOINT [ "node" , "/app/dist/main.js" ]
# CMD ["prisma", "migrate", "deploy" , "--create-db" ]

ENTRYPOINT [ "/bin/sh", "/app/start.sh" ]
