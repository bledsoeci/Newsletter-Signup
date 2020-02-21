const express = require('express');
const bodyParser = require('body-parser');
//axios replaces request
const axios = require('axios');
const app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', function (req, res) {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let apiKey = process.env.API_KEY;
    let data = {
        // Mailchimp required info: email_address & status - merge fields optional - verbage is set by Mailchimp (email_address, FNAME, merge_fields, etc)
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    // @ts-ignore
    axios({ 
        // url is the only required parameter
        url: 'https://us4.api.mailchimp.com/3.0/lists/1d57d84b9e', 
        // default method is GET
        method: "POST", 
        // Mailchimp only accepts JSON
        data: JSON.stringify(data), 
        //Mailchimp requires an API key - "auth" is axios'  required key name, and username and password are Mailchimp's 
        auth: {username: 'bledsoeci', password: apiKey} })
        .then(function (response) {
          res.sendFile(__dirname + '/success.html');
    })
        .catch(function (err) {
          res.sendFile(__dirname + '/failure.html');
          console.log(err);
    });
});

app.post('/failure', function (req, res) {
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running");
});

//list id 1d57d84b9e
