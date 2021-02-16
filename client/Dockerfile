FROM node
# replace this with your application's default port
EXPOSE 3000

ARG app_server
ARG app_port

ENV REACT_APP_SERVER_PORT=$app_port
ENV REACT_APP_SERVER_HOST=$app_server

ADD . /app

WORKDIR /app

RUN npm i

CMD ["npm","start"]