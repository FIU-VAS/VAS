To build this docker image 
	docker build -t vas_server --build-arg database_user=admin --build-arg database_password=adminpassword --build-arg database_url=localhost --build-arg database_name='test' .

To run this docker image
	docker run -it -p 4000:4000 -p 27017:27017 -v /path/to/empty/folder:/data/db --name vas-server vas_server