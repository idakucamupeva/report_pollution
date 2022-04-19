FROM node:17-alpine3.14

WORKDIR /frontend

COPY frontend .

WORKDIR /backend

COPY backend .

RUN npm install

CMD ["npm","start"]
