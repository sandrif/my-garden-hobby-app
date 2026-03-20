const express = require('express')
const app = express()
const port = 3000

const plantController = require("./controller/plant");
const collectionController = require("./controller/collection");

const cors = require("cors");
app.use(cors());

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.get('/', (req, res) => {
  res.send('Hello App!')
})


app.use("/plant", plantController);
app.use("/collection", collectionController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




