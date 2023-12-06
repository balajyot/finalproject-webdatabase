const { MongoClient } = require('mongodb');
const fs = require('fs');
const http = require('http'); 
const path = require('path');

// Connection URI for MongoDB
const uri = "mongodb+srv://jyothiravali007:Ravali%4012345@cluster0.e6yfrtx.mongodb.net/?retryWrites=true&w=majority";

// Name of the db you want to export
const dbName = 'TopStories';

// Name of the collection you want to export
const collectionName = 'Stories';

// Output JSON file path
const outputFilePath = 'public/output.json';

// Connect to MongoDB
async function connectToMongo() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    // Fetch data from the collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const data = await collection.find({}).toArray();

    // Save data to a JSON file
    saveToJsonFile(data);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Save data to a JSON file
function saveToJsonFile(data) {
  const jsonData = JSON.stringify(data, null, 2);

  fs.writeFile(outputFilePath, jsonData, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Data saved to', outputFilePath);
    }
  });
}

// Run the script
connectToMongo();

http.createServer((req, res) =>{
    console.log(req.url);
    if(req.url ==='/'){ // home page

       fs.readFile(path.join(__dirname,'public','index.html'),(err,content)=>{

        if (err) throw err ;
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(content)

       })

    }
    
    else if (req.url ==='/api'){
        fs.readFile(path.join(__dirname,'public','db.json'),(err,content)=>{

            if (err) throw err ;
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(content)
    
           })
    }

    else if (req.url ==='/data'){
        fs.readFile(path.join(__dirname,'public','output.json'),(err,content)=>{

            if (err) throw err ;
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(content)
    
           })
    }

    else{
        res.end("<h1> 404 Nothing is here </h1>")
    }


}).listen(1536,()=>console.log("Great our server is running on port 1536"));

 