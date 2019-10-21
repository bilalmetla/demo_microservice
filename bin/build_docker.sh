#!/usr/bin/env bash

cd ../
#build the docker image
docker build -t bilalmetla/my_microservice .
docker images
#run the conatiner from above image
docker run -it -p 3000:3000 -d bilalmetla/my_microservice
#find newly created container Id
#CONTAINERID=$(docker ps | awk '{print $1}')

#docker logs $CONTAINERID

# Enter the container
#docker exec -it $CONTAINERID /bin/bash