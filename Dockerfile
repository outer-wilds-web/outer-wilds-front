FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run

EXPOSE 8081
#CMD ["npm", "run", "serve"]