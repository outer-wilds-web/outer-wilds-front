FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers nécessaires pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port sur lequel Vite sera accessible
EXPOSE 5173

# Lancer le serveur de développement avec le host configuré
CMD ["npm", "run", "dev", "--", "--host"]
