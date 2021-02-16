FROM mongo
# replace this with your application's default port
EXPOSE 4000
EXPOSE 27017

ARG database_user
ARG database_password
ARG database_url
ARG database_name

ENV MONGODB_USERNAME=$database_user
ENV MONGODB_PASSWORD=$database_password
ENV MONGODB_URL=$database_url
ENV MONGODB_TABLE_NAME=$database_name
ENV MONGO_INITDB_ROOT_USERNAME=$database_user
ENV MONGO_INITDB_ROOT_PASSWORD=$database_password
ENV MONGO_INITDB_DATABASE=$database_name

RUN apt-get update && apt-get install -y nodejs && apt-get install -y npm

ADD . /app

WORKDIR /app

RUN npm i
RUN mongorestore --archive="/database/vas-backup"

RUN sleep 7 && nohup bash -c "./init.sh &"