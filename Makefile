##
# Ecotech - TP

.PHONY: help install back up down remove logs front run

help:
	@echo "EcoTech TP Project - Available commands:"
	@echo ""
	@printf "%-15s %s\n" "make install" "- Install dependencies for both backend and frontend"
	@printf "%-15s %s\n" "make front"  	"- Start only frontend dev server"
	@printf "%-15s %s\n" "make back"   	"- Start only backend API"
	@printf "%-15s %s\n" "make up"   		"- Rebuild and start backend API"
	@printf "%-15s %s\n" "make down"   	"- Stop backend API"
	@printf "%-15s %s\n" "make remove"  "- Remove backend API and its volumes"
	@printf "%-15s %s\n" "make logs"   	"- Log backend API"
	@printf "%-15s %s\n" "make run"   	"- Run backend API and frontend services"

install:
	@echo "Installing backend dependencies..."
	cd backend && npm install

back:
	@echo "Starting backend API..."
	cd backend && docker compose up

up:
	@echo "Rebuilding and starting backend API..."
	cd backend && docker compose up --build

down:
	@echo "Stopping backend API..."
	cd backend && docker compose down

remove:
	@echo "Removing backend API..."
	cd backend && docker compose down && rm -rf backend/data

logs:
	@echo "Logging backend API..."
	cd backend && docker compose logs -f

front:
	@echo "Starting frontend dev server..."
	npx http-server frontend -p 4000 --cors

run:
	@echo "Run backend API and frontend services"
	$(MAKE) -j2 back front # Permite que la aplicacion corra sin que se pisen.
# end
