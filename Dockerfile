FROM node:18.11
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install --force
RUN npm run build
EXPOSE 3000
ENTRYPOINT ["node", "./server/server.js"]