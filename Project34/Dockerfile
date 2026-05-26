FROM docker.1ms.run/library/golang:1.22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY . .

RUN go mod tidy

RUN CGO_ENABLED=0 GOOS=linux go build -o warehouse-app .

FROM docker.1ms.run/library/alpine:3.20

RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app

COPY --from=builder /app/warehouse-app .
COPY --from=builder /app/conf ./conf
COPY --from=builder /app/views ./views
COPY --from=builder /app/static ./static

EXPOSE 8080

CMD ["./warehouse-app"]
