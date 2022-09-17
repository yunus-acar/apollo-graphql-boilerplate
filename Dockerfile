FROM node:16-alpine
# FROM --platform=linux/x86_64 node:14-alpine

WORKDIR /app


COPY package.json yarn.lock ./
COPY prisma ./prisma

RUN yarn --pure-lockfile
#RUN yarn prisma db push
RUN yarn prisma generate

COPY . .

RUN yarn build

EXPOSE 4000

CMD [ "yarn", "start" ]
