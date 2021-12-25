FROM node:14

WORKDIR /nuxt-app/

COPY . ./
RUN yarn

EXPOSE 8080

ENV SUPABASE_URL=https://accckqbxpweiqnxmueft.supabase.co, SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODUzODA4MiwiZXhwIjoxOTU0MTE0MDgyfQ.u-ceKOGm-NDqa3lC7nYTL2OeAfMq6W6JOPohDCIFi9M
ENV HOST=0.0.0.0
ENV PORT=8080

RUN yarn build

CMD [ "yarn", "start" ]