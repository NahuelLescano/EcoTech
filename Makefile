##
# Ecotech - TP

.PHONY: help install back front

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
	npx http-server frontend -p 4000 --cors

run:
	@echo "Run backend API and frontend services"
	$(MAKE) -j2 back front # Permite que la aplicacion corra sin que se pisen.
# end
