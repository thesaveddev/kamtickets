FROM node:latest

LABEL MAINTAINER Abhishek Jalan <abhishek.jalan84@gmail.com>


## Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY . .

RUN npm install

EXPOSE 5000
CMD [ "node", "app" ]