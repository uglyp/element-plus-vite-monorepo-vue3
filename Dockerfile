FROM node:14.19.3-alpine3.16

ADD . /src/
ADD . /app/

WORKDIR /app

RUN npm config set registry https://registry.npm.taobao.org && npm install -g pnpm@7.2.1
