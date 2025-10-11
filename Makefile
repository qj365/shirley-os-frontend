COMPOSE = docker-compose -f docker-compose.yml

# Commands
up:
	@clear
	$(COMPOSE) up

up-d:
	@clear
	$(COMPOSE) up -d

down:
	@clear
	$(COMPOSE) down

build:
	@clear
	$(COMPOSE) build

restart:
	@clear
	$(COMPOSE) down
	$(COMPOSE) build
	$(COMPOSE) up

restart-d:
	@clear
	$(COMPOSE) down
	$(COMPOSE) build
	$(COMPOSE) up -d

logs:
	$(COMPOSE) logs -f


dev:
	@clear
	npm run dev
