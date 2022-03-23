# Functionality 
A server which when started accepts requests which can be used to save text documents to a database. Each text post will include a heading, text [no markup, just basic text] and a list of tags [from a pre-defined list]. It will be able for people to be 
emailed when they submit.

<br />

## Technologies
* Language - Typescript [Runtime - Nodejs]
* Framework - Nestjs 
* API - REST + GraphQL (?)
* Testing - Jest
* Queue - RabbitMQ 
* Deployment/Build - Docker
* Observability - OpenTelemetry + [Backend??]
* Cache - Redis 
* Database - MongoDB
* Code Linting - EsLint


<br />

## API Endpoints [REST]
/api/text - [GET, PUT, DELETE]
* GET: id - unique post id
* PUT: tags? - post tags, header - post header, text - the text in the post, email? - email to be emailed when the post has been posted
* DELETE: id - the id of the post to delete

/api/search - [GET]
* GET: tags - list of tags to search for in a post OR header - posts with that header, limit - the max amount of posts to return

/api/subscribe - [GET, POST, DELETE]
* GET: email - to get a list of subscriptions for that email
* POST: email - email to be emailed, tags - list of tags for which the email will be emailed when a post is posted [must include all specified tags]
* DELETE: email - an email with the subscription, tags - a list of tags for which a subscription exists, it deletes it.

/api/stats - [GET]
* GET: projection - an object specifying which statistics should be returned: 
  * total - total number of added documents 
  * ???

<br />

## API Endpoints [GraphQL]
/api/graphql
* Further information can be gathered by graphql explorer. *Might* be added here as well.

<br />
<br />

**Please Note**: While this project does introduce interesting functionality, it is **not** safe to email users without their approval [and being sure that they have given an email that they own]. If similar functionality is provided for production, user accounts must be used or not send any email messages. That won't [probably] be implemented in this *learning* project of mine.