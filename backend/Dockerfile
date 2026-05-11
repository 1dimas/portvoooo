FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy semua file kode kamu
COPY . .

# PENTING: Hugging Face WAJIB pakai port 7860
EXPOSE 7860

# Jalankan bot kamu (sesuaikan index.js dengan file utama kamu)
CMD ["node", "index.js"]