FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod ./
RUN go mod edit -go=1.22
COPY main.go ./
COPY templates ./templates
COPY static ./static
RUN go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -o access-system .

FROM alpine:3.20
WORKDIR /app
RUN apk add --no-cache ca-certificates tzdata
ENV TZ=Asia/Shanghai
COPY --from=builder /app/access-system .
COPY templates ./templates
COPY static ./static
EXPOSE 8080
CMD ["./access-system"]
