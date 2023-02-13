#!/bin/sh
npx prisma migrate deploy
npx prisma generate
node /app/dist/main.js