FROM golang:1.11 as goBuilder

WORKDIR /build/server

COPY ./src/config ./config
COPY ./src/go.mod ./go.mod
COPY ./src/go.sum ./go.sum
COPY ./src/main.go ./main.go

RUN GO111MODULE=on CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ./dist/server -a . 

FROM node:10.13.0 as nodeBuilder

WORKDIR /build/frontened

COPY ./package.json .

RUN npm i

COPY . .

RUN npm run build:production

FROM scratch

WORKDIR /website

COPY --from=goBuilder /build/server/dist .
COPY --from=nodeBuilder /build/frontened/dist/ .

EXPOSE 80

CMD ["./server"]
