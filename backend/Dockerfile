ARG GO_VERSION=1.25.1

FROM golang:${GO_VERSION}-alpine AS base
WORKDIR /app
RUN apk add --no-cache build-base git curl
COPY go.mod go.sum ./
# Cache modules
RUN --mount=type=cache,target=/go/pkg/mod go mod download

FROM base AS dev
RUN curl -fsSL https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh -s -- -b /usr/local/bin
COPY . .
EXPOSE 8001
CMD ["air", "-c", ".air.toml"]

FROM base AS build
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
