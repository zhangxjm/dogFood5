FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN npm install --production

COPY . .

RUN if [ ! -f "data.db" ]; then node init-data.js; fi

EXPOSE 3000

CMD ["node", "server.js"]
