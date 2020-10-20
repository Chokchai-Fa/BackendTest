const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')
const app = express()


app.use(cors( { origin:true} ))

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://backendtest-b2fa8.firebaseio.com"
});

const db = admin.firestore();




/*
app.get('/get',(req,res)=>{
    return res.status(200).send("Test")
})*/

//ReadAll
app.get('/api/read/all',(req,res)=>{
   
    (async () =>{
        try{
            const document = db.collection('log')
            var response = []
            
            await document.get().then(querySnapshot => {
                var logs = querySnapshot.docs

                for (let log of logs){
                    const item ={
                        id : log.id,
                        fullname:log.data().fullname,
                        birthday:log.data().birthday,
                        address:log.data().address,
                        description:log.data().description,
                        createdAt: log.data().createdAt,
                        updateAt: log.data().updateAt
                    }
                    response.push(item)
                }
                return response
            })
            return res.status(200).send(response)
            }
        
        catch (error)
        {
            console.log(error)
            return res.status(500).send(error)
        }

    })()
    
})

//Read
app.get('/api/read/:id', (req,res)=>{

    (async () =>{
        try{
            const document = db.collection('log').doc(req.params.id)
            let log = await document.get()
            let response = log.data()
            return res.status(200).send(response)
            }
        
        catch (error)
        {
            console.log(error)
            return res.status(500).send(error)
        }

    })()


})

//Create
app.post('/api/create', (req,res)=>{

    (async () =>{
        try{
            await db.collection('log').doc('/'+req.body.id+'/')
            .create({
                fullname:req.body.fullname,
                birthday:req.body.birthday,
                address:req.body.address,
                description:req.body.description,
                createdAt: admin.firestore.Timestamp.now(),
                updateAt: admin.firestore.Timestamp.now()
            })

            return res.status(200).send()
        }
        catch (error)
        {
            console.log(error)
            return res.status(500).send(error)
        }

    })()


})


//update
app.put('/api/update/:id', (req,res)=>{

    (async () =>{
        try{
            const document = db.collection('log').doc(req.params.id)

            await document.update({
                fullname:req.body.fullname,
                birthday:req.body.birthday,
                address:req.body.address,
                description:req.body.description,
                updateAt: admin.firestore.Timestamp.now()
            })

            return res.status(200).send()
        }
        catch (error)
        {
            console.log(error)
            return res.status(500).send(error)
        }

    })()


})

//Delete
app.delete('/api/delete/:id',(req,res)=>{
    (async () => {

        try 
        {
            const document = db.collection('log').doc(req.params.id)
            await document.delete()
            return res.status(200).send()
        }
        catch (error)
        {
            console.log(error)
            return res.status(500).send(error)
        }
    })()

})




//Export the API to Firebase Cloud
exports.app = functions.https.onRequest(app);
