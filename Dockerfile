FROM node:18

# Create app directory
WORKDIR /usr/src/product/app

# Install app dependencies
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8083
CMD [ "node", "server.js" ]

#docker build -t api-product . 
#docker run --name api-product -p 8083:8083 -d api-product