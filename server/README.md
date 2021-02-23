To build this docker image 
	docker build -t vas_server --build-arg database_user=admin --build-arg database_password=adminpassword --build-arg database_url=localhost --build-arg database_name='test' .

To run this docker image
	docker run -it -p 4000:4000 -p 27017:27017 -v /path/to/empty/folder:/data/db --name vas-server vas_server

## Docker-Compose instructions

If you had already started the project before pulling the docker-compose configuration make sure to delete
the node_modules and .npm directories inside the server folder. <br> <br>
First make sure to have the vas-backup in the /db/restore folder in the root
of the project to make sure you get the latest copy of the production database.

Start all containers:<br>
`docker-compose up -d`

Execute command in api container where command is something like `npm run migrate-up`:<br>
`docker-compose exec api <COMMAND>`
(Same can be used with any other container [`mongo`, `nginx`])

Restart a container: <br>
`docker-compose restart [container]` Where container can be [`mongo`, `nginx`, `api`] 

Remove data and stop containers: <br>
`docker-compose down`

See logs for specific container: <br>
`docker-compose logs -f -t [container]`