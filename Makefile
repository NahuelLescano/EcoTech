##
# Ecotech - TP

.PHONY: help up down logs db backend front install

help:
	@echo "EcoTech TP Project - Available commands:"
	@echo ""
	@printf "%-15s %s\n" "make install"   "- Install dependencies for both backend and frontend"
	@printf "%-15s %s\n" "make backend"   "- Start only backend API"
	@printf "%-15s %s\n" "make frontend"  "- Start only frontend dev server"

install:
	@echo "Installing backend dependencies..."
	cd backend && npm install

back:
	cd backend && npm run dev

front:
	npx http-server frontend -p 3000 --cors

run: back front
# end
