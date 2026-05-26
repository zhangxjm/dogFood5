FROM golang:1.21-alpine AS builder

RUN apk add --no-cache git

WORKDIR /app

COPY go.mod ./
RUN go mod tidy

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o hardware-shop .

FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

COPY --from=builder /app/hardware-shop .
COPY templates/ ./templates/
COPY static/ ./static/

EXPOSE 8080

CMD ["./hardware-shop"]
