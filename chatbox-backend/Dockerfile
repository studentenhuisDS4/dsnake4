FROM node:12

# Create app directory
WORKDIR /app
RUN chmod -R 775 /app
# Install app dependencies
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]