FROM node:18-alpine

WORKDIR /app

COPY package.json prisma ./ 
COPY yarn.lock ./

RUN yarn

RUN npx prisma generate

COPY . .

RUN yarn build

EXPOSE 5000

CMD ["yarn", "start:dev"]
