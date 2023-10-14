FROM node:20-alpine

RUN mkdir /threejs

WORKDIR /threejs

RUN npm update -g npm
RUN npm install -g pnpm
