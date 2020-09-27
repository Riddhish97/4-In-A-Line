FROM node:carbon-alpine
RUN npm config set unsafe-perm true
RUN npm install pm2 -g
RUN apk add bash
WORKDIR /opt/game
COPY package.json ./
RUN npm install
COPY ./public ./public
COPY .env ./
COPY . .
CMD ["./wait-for-it.sh", "mongodb:27017", "-t", "120", "--", "sh", "start.sh"]
