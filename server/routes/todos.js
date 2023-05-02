const express = require('express')
const router = express.Router()
const Todo = require('../models/todo')

//getting all
router.get('/', async (req,res)=>{
    try{
        const todos = await Todo.find()
        res.json(todos)
    } catch (err){
        res.status(500).json({message: err.message})
    }
})

////getting one
//router.get('/:id', getTodo, (req,res)=>{
//    //req.params.id to access id param
//    res.json(res.todo)
//})

//creating one
router.post('/', async (req,res)=>{
    console.log(JSON.stringify(req.body))
    const todo = new Todo({
        id: req.body.id,
        name: req.body.name,
        complete: req.body.complete
    })

    try{
        const newTodo = await todo.save()
        res.status(201).json(newTodo)
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

//updating one
router.patch('/:id', async (req,res)=>{
    try{
        res.todo = await getTodoByID(req, res)

        if (req.body.id != null) {
            res.todo.id = req.body.id
        }
        if (req.body.name != null){
            res.todo.name = req.body.name
        }
        if (req.body.complete != null){
            res.todo.complete = req.body.complete
        }

        console.log()

        const updatedTodo = await Todo.updateOne({id: req.params.id}, { $set: res.todo})
        res.json(updatedTodo)
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

//deleting one
//router.delete('/:id', getTodo, async (req,res)=>{
//    try {
//        await res.todo.deleteOne()
//        res.json({message: 'Deleted todo'})
//    } catch (err){
//        res.status(500).json({message: err.message})
//    }
//})

//deleting many
router.delete('/', async (req,res)=>{
    console.log(req.body.ids)
    try {
        await Todo.deleteMany({id: {$in: req.body.ids}})
        res.json({message: 'Deleted todos'})
    } catch (err){
        res.status(500).json({message: err.message})
    }
})

//middleware 
/*
async function getTodo(req, res, next){
    let todo
    try {
        todo = await Todo.findById(req.params.id)
        if(todo ==null){
            return res.status(404).json({message: "cannot find todo"})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.todo = todo
    next()
}*/

async function getTodoByID(req, res){
    let todo
    try {
        //select field "id" instead of "_id"
        todo = await Todo.find({id: req.params.id})
        todo = todo[0]
        if(todo ==null){
            return res.status(404).json({message: "cannot find todo"})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    
    return todo
}

module.exports = router