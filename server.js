import express from "express"
import axios from 'axios'
import bodyParser  from 'body-parser'
import cors  from 'cors'


const app = express();

let allData = {}
let output = {}

app.use(express.json())

//app.use(cors())

app.use(bodyParser.json({limit: '10000mb'}))

app.get('/topPicks', (req, res) => {
    const metaverse = req.query.metaverse;
    console.log(metaverse)
    getTop5Lands(metaverse, 0, 2000, ()=>{
        // Object.keys(output).length.toString() number of lands
        let ordered = Object.keys(output).map(item => {
            if (output[item]["current_price"] ==  null) {
                output[item]["gap"] = "NO GAP";
            } else {
                output[item]["gap"] = (output[item]["current_price"]/output[item]["predicted_price"]) - 1;
            }
            return output[item]["gap"]
        }).filter(gap => gap !== "NO GAP")
        res.send({ordered})
    });
})


function getTop5Lands(landName, from, size, callback){
    const url = `https://services.itrmachines.com/${landName}/requestMap?from=${from}&size=${size}`
    console.log(url);
    axios.get(url)
    .then((response) => {
        if (Object.keys(response.data).length != 0) {
            output = Object.assign(allData, response.data)
            from = from + 2000;
            getTop5Lands(landName, from, size, callback);
        } else {
            callback();
        }
    })
    .catch((error) => console.log(error))
}

const PORT = process.env.PORT || 3003

app.listen(PORT , () => {
    console.log(`Server running on port ${PORT} 🔥`)
})