# Gunakan image Node.js resmi dengan versi yang sesuai
FROM node:22-alpine

# Set working directory di dalam container
WORKDIR /usr/src/app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file proyek
COPY . .

# Expose port yang digunakan Express
EXPOSE 3000

# Jalankan aplikasi
CMD ["node", "index.js"] 