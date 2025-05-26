FROM node:22.14.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm ci --only=production
EXPOSE 8080
CMD ["npm", "start"]