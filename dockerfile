FROM node:18-alpine
RUN apk add --no-cache libc6-compat

WORKDIR /frontend

ENV NEXT_TELEMETRY_DISABLED 1
ENV PROXY_URL http://api:8000/
ENV SITE_URL https://topimpech.ru
ENV PORT 3000

COPY  ./package*.json ./

RUN npm install pm2 -g
RUN npm install

COPY  . .

RUN npm run build

RUN chown -R node:node /frontend/.next

USER node


EXPOSE 3000

CMD [ "pm2-runtime", "start", "npm", "--", "start" ]

