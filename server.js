var express=require('express');
var app=express();
var mongoose=require('mongoose');
var morgan=require('morgan');
var bodyParser=require('body-parser');
var methodOverride=require('method-override');

mongoose.connect('mongodb://localhost:27017/tododb')
var db=mongoose.connection;
//mongoose.connect('mongodb://test:test@apollo.modulusmongo.net:27017/ruNig7uh');     // connect to mongoDB database on modulus.io
// mongo uri: mongodb://test:test@apollo.modulusmongo.net:27017/ruNig7uh
// mongo console: mongo apollo.modulusmongo.net:27017/ruNig7uh -u <user> -p <pass>
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// the model
var Todo=mongoose.model('Todo',{
    text:String,
    complete:Boolean
});



// api
// all todos
app.get('/api/todos', function(req, res) {
        // use mongoose to get all todos in the database
        Todo.find(function(err, todos) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(todos); // return all todos in JSON format
        });
    });
 
//create and add new Todo, send back everything after that
app.post('/api/todos', function(req, res) {

        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text : req.body.text,
            complete : false
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });
///////////////////////////done
app.post('/api/save/:todo_id', function(req, res) {
        //console.log(req.params.todo_id+" save");
        var collection=db.collection("todos");
    
        var isDone;
        Todo.find({_id:req.params.todo_id},function(err,obj){
            console.log(obj[0].complete);
            
            Todo.update({_id:req.params.todo_id},{
            complete:!obj[0].complete
        },function(err, affected, resp) {
            console.log(resp);
    });
        });
        //console.log(isDone);
        
});
//remove a todo entry
app.delete('/api/todos/:todo_id', function(req, res) {
        Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });


app.get('*',function(req,res){
    res.sendfile('index.html');
});

// listen (start app with node server.js) ======================================
app.listen(9999);
console.log("App listening on port 9999");
