FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm ci # Ya existe package-lock, por eso usamos ci para instalar dependencias exactas y mas rapido

COPY ./src ./src


CMD ["node", "./src/index.js"]
