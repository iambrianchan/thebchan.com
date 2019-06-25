FROM node:8

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .
RUN ./node_modules/grunt/bin/grunt

EXPOSE 8080

CMD ["node", "server.js"]