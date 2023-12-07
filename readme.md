Production/Deployment:
Api client currently tracks a url variable. In production this should be "/"

Select the deployment branch from gh
Root Directory : ./server
Build Command : npm i && cd ../client && npm i && npm run build
Start Command : node index.js

Environmnet Variables
MONGO_STRING = "Mongo Connection string"

Dev:
Api client currently tracks a url variable. In production this should be "http://localhost:5000/"

./server/.env :
PORT = 5000
MONGO_STRING = "Mongo Connection string"

npm run devInstall -- install client/server
npm run dev -- run client/server concurrently

Current deploy time ~ 3 min
