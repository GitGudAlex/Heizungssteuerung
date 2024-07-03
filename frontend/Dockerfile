FROM node:20.5.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Astro needs a .env file to make environment variables available at build time, so we copy the .env.docker file to .env
COPY .env.docker .env

RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

CMD ["node", "dist/server/entry.mjs"]