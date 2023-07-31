FROM node:18-alpine
WORKDIR /miniMessageBoard
COPY . .
RUN yarn install --production
CMD ["node", "server.js"]
EXPOSE 3000