# 1. Используем лёгкий Node.js образ
FROM node:20-alpine

# 2. Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# 3. Копируем package.json и package-lock.json
COPY package*.json ./

# 4. Устанавливаем зависимости
RUN npm install --production

# 5. Копируем остальные файлы проекта
COPY . .

# 6. Указываем порт, который слушает сервер
EXPOSE 5000

# 7. Команда запуска контейнера
CMD ["npm", "start"]
