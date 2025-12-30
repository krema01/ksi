FROM node:22.12-bullseye

WORKDIR /app

# 1. Copy only package.json + lock file first
COPY package*.json ./

# 2. Install deps (inside container)
RUN npm install

# 3. Copy the rest of the app (but NOT node_modules)
COPY . .

# 4. Expose Vite dev server port (default 5173)
EXPOSE 5173

# Start Vite dev server and bind to 0.0.0.0 so it's accessible from outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
