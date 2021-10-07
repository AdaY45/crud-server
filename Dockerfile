FROM node:14.18.0
WORKDIR /api
COPY package.json .
RUN yarn install
COPY . .
EXPOSE 5000
CMD ["yarn", "dev"]