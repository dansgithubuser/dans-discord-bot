FROM node

WORKDIR /dans-discord-bot

COPY package.json .
COPY package-lock.json .

RUN apt update
RUN apt install -y vim
RUN npm ci

COPY src src
COPY do.py .

ENTRYPOINT npm run start
