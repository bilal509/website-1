docker-build:
	docker build -t hyperprivacy/website .

docker-push:
	docker push hyperprivacy/website

docker-run:
	docker run -p 8080:8080 hyperprivacy/website