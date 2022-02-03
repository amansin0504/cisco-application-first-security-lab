/* Copyright (c) 2017 Weaveworks and/or its affiliates.
 * https://github.com/microservices-demo/front-end
 *
 * Modifications copyright (C) 2020 Cisco
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. */

(function() {
    'use strict';

    var async = require("async"), express = require("express"), request = require("request"), endpoints = require("../endpoints"), helpers = require("../../helpers"), app = express(), cookie_name = "logged_in"

    //DUO
    var http = require('http'), url = require('url'), qs = require('querystring'), duo_web = require('../../helpers/duo.js')
    var duo_post_action = '/2fa', duo_ikey = process.env.DUO_IKEY, duo_skey = process.env.DUO_SKEY, duo_api_hostname = process.env.DUO_API_HOSTNAME
console.log(duo_ikey, duo_skey, duo_api_hostname)
    var duo_iframe = (duo_api_hostname, duo_sig_request, duo_post_action) => {
      return `<!DOCTYPE html>
      <html>
        <head>
          <title>Duo Authentication Prompt</title>
          <meta name='viewport' content='width=device-width, initial-scale=1'>
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <style>
            body {
                text-align: center;
            }

            iframe {
                width: 100%;
                min-width: 304px;
                max-width: 620px;
                height: 330px;
                border: none;
            }
          </style>
        </head>
        <body>
          <h1>Duo Authentication Prompt</h1>
          <iframe id="duo_iframe"
                  title="Two-Factor Authentication"
                  data-host= ${duo_api_hostname}
                  data-sig-request= ${duo_sig_request}
                  data-post-action=${duo_post_action}
                  >
          </iframe>
          <script src='https://api.duosecurity.com/frame/hosted/Duo-Web-v2.min.js'></script>
        </body>
      </html>`
    }
    //DUO

    app.get("/customers/:id", function(req, res, next) {
        helpers.simpleHttpRequest(endpoints.customersUrl + "/" + req.session.customerId, res, next);
    });
    app.get("/cards/:id", function(req, res, next) {
        helpers.simpleHttpRequest(endpoints.cardsUrl + "/" + req.params.id, res, next);
    });

    app.get("/customers", function(req, res, next) {
        helpers.simpleHttpRequest(endpoints.customersUrl, res, next);
    });
    app.get("/addresses", function(req, res, next) {
        helpers.simpleHttpRequest(endpoints.addressUrl, res, next);
    });
    app.get("/cards", function(req, res, next) {
        helpers.simpleHttpRequest(endpoints.cardsUrl, res, next);
    });

    // Create Customer - TO BE USED FOR TESTING ONLY (for now)
    app.post("/customers", function(req, res, next) {
        var options = {
            uri: endpoints.customersUrl,
            method: 'POST',
            json: true,
            body: req.body
        };

        console.log("Posting Customer: " + JSON.stringify(req.body));

        request(options, function(error, response, body) {
            if (error) {
                return next(error);
            }
            helpers.respondSuccessBody(res, JSON.stringify(body));
        }.bind({
            res: res
        }));
    });

    app.post("/addresses", function(req, res, next) {
        req.body.userID = helpers.getCustomerId(req, app.get("env"));

        var options = {
            uri: endpoints.addressUrl,
            method: 'POST',
            json: true,
            body: req.body
        };
        console.log("Posting Address: " + JSON.stringify(req.body));
        request(options, function(error, response, body) {
            if (error) {
                return next(error);
            }
            helpers.respondSuccessBody(res, JSON.stringify(body));
        }.bind({
            res: res
        }));
    });

    app.get("/card", function(req, res, next) {
        var custId = helpers.getCustomerId(req, app.get("env"));
        var options = {
            uri: endpoints.customersUrl + '/' + custId + '/cards',
            method: 'GET',
        };
        request(options, function(error, response, body) {
            if (error) {
                return next(error);
            }
            var data = JSON.parse(body);
            if (data.status_code !== 500 && data._embedded.card.length !== 0 ) {
                var resp = {
                    "number": data._embedded.card[0].longNum.slice(-4)
                };
                return helpers.respondSuccessBody(res, JSON.stringify(resp));
            }
            return helpers.respondSuccessBody(res, JSON.stringify({"status_code": 500}));
        }.bind({
            res: res
        }));
    });

    app.get("/address", function(req, res, next) {
        var custId = helpers.getCustomerId(req, app.get("env"));
        var options = {
            uri: endpoints.customersUrl + '/' + custId + '/addresses',
            method: 'GET',
        };
        request(options, function(error, response, body) {
            if (error) {
                return next(error);
            }
            var data = JSON.parse(body);
            if (data.status_code !== 500 && data._embedded.address.length !== 0 ) {
                var resp = data._embedded.address[0];
                return helpers.respondSuccessBody(res, JSON.stringify(resp));
            }
            return helpers.respondSuccessBody(res, JSON.stringify({"status_code": 500}));
        }.bind({
            res: res
        }));
    });

    app.post("/cards", function(req, res, next) {
        req.body.userID = helpers.getCustomerId(req, app.get("env"));

        var options = {
            uri: endpoints.cardsUrl,
            method: 'POST',
            json: true,
            body: req.body
        };
        console.log("Posting Card: " + JSON.stringify(req.body));
        request(options, function(error, response, body) {
            if (error) {
                return next(error);
            }
            helpers.respondSuccessBody(res, JSON.stringify(body));
        }.bind({
            res: res
        }));
    });

    // Delete Customer - TO BE USED FOR TESTING ONLY (for now)
    app.delete("/customers/:id", function(req, res, next) {
        console.log("Deleting Customer " + req.params.id);
        var options = {
            uri: endpoints.customersUrl + "/" + req.params.id,
            method: 'DELETE'
        };
        request(options, function(error, response, body) {
            if (error) {
                return next(error);
            }
            helpers.respondSuccessBody(res, JSON.stringify(body));
        }.bind({
            res: res
        }));
    });

    // Delete Address - TO BE USED FOR TESTING ONLY (for now)
    app.delete("/addresses/:id", function(req, res, next) {
        console.log("Deleting Address " + req.params.id);
        var options = {
            uri: endpoints.addressUrl + "/" + req.params.id,
            method: 'DELETE'
        };
        request(options, function(error, response, body) {
            if (error) {
                return next(error);
            }
            helpers.respondSuccessBody(res, JSON.stringify(body));
        }.bind({
            res: res
        }));
    });

    // Delete Card - TO BE USED FOR TESTING ONLY (for now)
    app.delete("/cards/:id", function(req, res, next) {
        console.log("Deleting Card " + req.params.id);
        var options = {
            uri: endpoints.cardsUrl + "/" + req.params.id,
            method: 'DELETE'
        };
        request(options, function(error, response, body) {
            if (error) {
                return next(error);
            }
            helpers.respondSuccessBody(res, JSON.stringify(body));
        }.bind({
            res: res
        }));
    });

    app.post("/register", function(req, res, next) {
        var options = {
            uri: endpoints.registerUrl,
            method: 'POST',
            json: true,
            body: req.body
        };

        console.log("Posting Customer: " + JSON.stringify(req.body));

        async.waterfall([
                function(callback) {
                    request(options, function(error, response, body) {
                        if (error !== null ) {
                            callback(error);
                            return;
                        }
                        if (response.statusCode == 200 && body != null && body != "") {
                            if (body.error) {
                                callback(body.error);
                                return;
                            }
                            console.log(body);
                            var customerId = body.id;
                            console.log(customerId);
                            req.session.customerId = customerId;
                            //DUO
                            var customerUsername = req.body.username;
                            console.log(customerUsername);
                            req.session.username = customerUsername;
                            req.session.referrer = req.get('Referrer');
                            //DUO
                            callback(null, customerId);
                            return;
                        }
                        console.log(response.statusCode);
                        callback(true);
                    });
                },
                function(custId, callback) {
                    var sessionId = req.session.id;
                    console.log("Merging carts for customer id: " + custId + " and session id: " + sessionId);

                    var options = {
                        uri: endpoints.cartsUrl + "/" + custId + "/merge" + "?sessionId=" + sessionId,
                        method: 'GET'
                    };
                    request(options, function(error, response, body) {
                        if (error) {
                            if(callback) callback(error);
                            return;
                        }
                        console.log('Carts merged.');
                        if(callback) callback(null, custId);
                    });
                }
            ],
            function(err, custId) {
                if (err) {
                    console.log("Error with log in: " + err);
                    res.status(500);
                    res.end();
                    return;
                }
                //DUO
                //console.log("set cookie" + custId);
                //res.status(200);
                //res.cookie(cookie_name, req.session.id, {
                //    maxAge: 3600000
                //}).send({id: custId});
                //console.log("Sent cookies.");
                res.status(200);
                //DUO
                res.end();
                return;
            }
        );
    });

    //DUO
    app.get(duo_post_action, function(req, res, next) {
        console.log("Received 2fa request");
        console.log(duo_ikey, duo_skey, req.session.username)
        let duo_sig_request = duo_web.sign_request(duo_ikey, duo_skey, req.session.username)
        let duo_frame = duo_iframe(duo_api_hostname, duo_sig_request, duo_post_action)
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(duo_frame)
        return;
    })

    app.post(duo_post_action, function(req, res, next) {

      console.log("Received 2fa verification request");

      let request_body = ''

      req.on('data', data => {
        request_body += data.toString() // convert Buffer to string
      })

      req.on('end', () => {
        let form_data = qs.parse(request_body)
        let duo_sig_response = form_data.sig_response
        // verifies that the signed response is legitimate
        let authenticated_username = duo_web.verify_response(duo_ikey, duo_skey, duo_sig_response)
        if (authenticated_username) {
          console.log('Authenticated')
          res.cookie(cookie_name, req.session.id, {
            maxAge: 3600000
          })
          res.redirect(req.session.referrer)
          console.log('Cookie is set')
        } else {
          console.log("Error with 2fa");
          res.status(401);
          res.end();
          return;
        }
      })

    });
    //DUO

    app.get("/login", function(req, res, next) {
        console.log("Received login request");

        async.waterfall([
                function(callback) {
                    var options = {
                        headers: {
                            'Authorization': req.get('Authorization')
                        },
                        uri: endpoints.loginUrl
                    };
                    request(options, function(error, response, body) {
                        if (error) {
                            callback(error);
                            return;
                        }
                        if (response.statusCode == 200 && body != null && body != "") {
                            console.log(body);
                            var customerId = JSON.parse(body).user.id;
                            console.log(customerId);
                            req.session.customerId = customerId;
                            //DUO
                            var customerUsername = JSON.parse(body).user.username;
                            console.log(customerUsername);
                            req.session.username = customerUsername;
                            req.session.referrer = req.get('Referrer');
                            //DUO
                            callback(null, customerId);
                            return;
                        }
                        console.log(response.statusCode);
                        callback(true);
                    });
                },
                function(custId, callback) {
                    var sessionId = req.session.id;
                    console.log("Merging carts for customer id: " + custId + " and session id: " + sessionId);

                    var options = {
                        uri: endpoints.cartsUrl + "/" + custId + "/merge" + "?sessionId=" + sessionId,
                        method: 'GET'
                    };
                    request(options, function(error, response, body) {
                        if (error) {
                            // if cart fails just log it, it prevenst login
                            console.log(error);
                            //return;
                        }
                        console.log('Carts merged.');
                        callback(null, custId);
                    });
                }
            ],
            function(err, custId) {
                if (err) {
                    console.log("Error with log in: " + err);
                    res.status(401);
                    res.end();
                    return;
                }
                //DUO
                //res.cookie(cookie_name, req.session.id, {
                //    maxAge: 3600000
                //}).send('Cookie is set');
                //console.log("Sent cookies.");
                //res.end();
                if (req.session.username == "user") {
                    console.log('test user');
                    res.cookie(cookie_name, req.session.id, {
                        maxAge: 3600000
                    }).send('Cookie is set');
                    console.log("Sent cookies.");
                    res.end();
                } else {
                    res.status(200);
                    res.end(duo_post_action);
                }
                //DUO
                return;
            });
    });

    module.exports = app;
}());
