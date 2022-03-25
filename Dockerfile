FROM node:16-alpine3.14
COPY ./ /

RUN npm install 
RUN npm run test
RUN npm run build

CMD npm run start

EXPOSE 80/tcp