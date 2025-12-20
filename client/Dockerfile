FROM node:18

WORKDIR /app

# 1. Copy only package.json + lock file first
COPY package*.json ./

# 2. Install deps (inside container)
RUN npm install

# 3. Copy the rest of the app (but NOT node_modules)
COPY . .

# 4. Expose dev server port
EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]
