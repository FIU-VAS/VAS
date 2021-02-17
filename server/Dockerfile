FROM mongo
# replace this with your application's default port
EXPOSE 27017

RUN mongorestore --archive="/database/vas-backup"
