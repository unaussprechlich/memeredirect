FROM node:alpine

COPY . .

RUN ls
RUN npm install --production

EXPOSE 3000

CMD [ "node", "app.js" ]

