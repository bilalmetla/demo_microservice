# demo_microservice
This is a demo for microservice application in `nodejs`. Its implemented using `graphql` and `express` also included `Unit tests` and `behaviour tests` using `mocha` and `chai`.<br/><br/>
To deployee this on `docker` I have added a `build_docker.sh` file into **/bin/ directory**. So you can deployee just running this file. This is a shell script file.<br/>

**step:**
* `cd ./bin/`
* `sudo ./build_docker.sh`
<br/>
This file will automatically setup a docker image of my application and start it.
So now you can run test cases by using command `mocha run test`
All data will be stored into `/db/data/ directory`.
