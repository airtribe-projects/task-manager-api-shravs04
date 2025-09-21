const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const tasksList = JSON.parse(fs.readFile('./task.json', 'utf-8')).tasks;

app.get('/tasks', (req, res) => {
    res.send(tasksList);
})

app.get('/tasks/:id', (req, res) => {
    const id = req.params.id;
    const checkTask = tasksList.find(task => task.id === parseInt(id));

    if(!checkTask){
        res.status(404).send("Not found");
        return;
    }
    res.send(checkTask);
})

app.post('/tasks', (req, res) => {
    const reqBody = req.body;
    if(reqBody.description == '' || reqBody.title == ''){
        res.status(400).send("Title & description should not be empty");
        return;
    }
    reqBody.id = tasksList.length ? tasksList[tasksList.length-1].id+1: '';
    tasksList.push(reqBody);
    res.send(reqBody)
})

app.put('/tasks/:id', (req, res) => {
    if(parseInt(req.params.id) > tasksList.length){
        res.status(404).send("Not found");
        return;
    }
    const checkTask = tasksList.find(task => task.id === parseInt(req.params.id));
    checkTask.title = req.params.title;
    checkTask.description = req.params.description;
    checkTask.completed = req.params.completed;
    res.send(checkTask)
})

app.delete('/tasks/:id', (req, res) => {
    if(parseInt(req.params.id) > tasksList.length){
        res.status(404).send("Not found");
        return;
    }
    const id = req.params.id;
    const checkTask = tasksList.findIndex(task => task.id === parseInt(id));
    tasksList.splice(checkTask,1)

    res.send("deleted")
})

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;