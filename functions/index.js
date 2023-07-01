/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require('firebase-functions');
const express = require('express');
const engines = require('consolidate');
var hbs = require('handlebars');
const admin = require('firebase-admin');

const app = express();
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

admin.initializeApp(functions.config().firebase);

async function getFirestore(){
    const firestore_con  = await admin.firestore();
    const writeResult = firestore_con.collection('sample').doc('sample_doc').get().then(doc => {
    if (!doc.exists) { console.log('No such document!'); }
    else {return doc.data();}})
    .catch(err => { console.log('Error getting document', err);});
    return writeResult
    }

    app.get('/',async (request,response) =>{
        var db_result = await getFirestore();
        response.render('index',{db_result});
        });
        exports.app = functions.https.onRequest(app);

// write to form_data !!!!!
async function insertFormData(request){
const writeResult = await admin.firestore().collection('form_data').add({
firstname: request.body.firstname,
lastname: request.body.lastname
})
.then(function() {console.log("Document successfully written!");})
.catch(function(error) {console.error("Error writing document: ", error);});
}

app.post('/insert_data',async (request,response) =>{
    var insert = await insertFormData(request);
    response.sendStatus(200);
    });
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
