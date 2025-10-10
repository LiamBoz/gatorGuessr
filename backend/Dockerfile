ARG GO_VERSION=1.25.1
FROM golang:${GO_VERSION}-alpine AS build

WORKDIR /app

COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download

COPY . .
RUN --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -o /server .

FROM gcr.io/distroless/base-debian12
WORKDIR /app
COPY --from=build /server /server
EXPOSE 8001
USER nonroot:nonroot
ENTRYPOINT ["/server"]
