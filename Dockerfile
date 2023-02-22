FROM public.ecr.aws/docker/library/node:18

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm ci --omit=dev --ignore-scripts

COPY . .

RUN npm ci --omit=dev

CMD [ "npm", "run", "start" ]
