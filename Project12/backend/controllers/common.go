package controllers

import "log"

type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Total   int         `json:"total,omitempty"`
}

func logError(err error) {
	if err != nil {
		log.Printf("Error: %v", err)
	}
}
