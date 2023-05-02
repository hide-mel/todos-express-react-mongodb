import React, {useState, useRef, useEffect} from 'react'
import TodoList from './components/TodoList'
import { v4 as uuidv4 } from 'uuid';

//const LOCAL_STORAGE_KEY = 'todoApp.todos'

const App = () => {
  const [todos, setTodos] = useState([])
  const todoNameRef = useRef()

  useEffect(() => {
    //const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    //console.log(storedTodos)
    //if (storedTodos) setTodos( prevTodos => [...prevTodos, ...storedTodos] )
    fetch("/todos").then(
      response => response.json()
    ).then(
      storedTodos => {
      if (storedTodos) setTodos([...storedTodos] )
    })
  }, [])

  //useEffect(() => {
  //  //localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos))
  //}, [todos])

  

  function toggleTodo(id) {
    //console.log(id)
    const newTodos = [...todos]
    const todo = newTodos.find(todo => todo.id === id)
    todo.complete = !todo.complete
    //console.log(todo.complete)
    const query = { "complete": todo.complete }
    const reqType = 'PATCH'
    const param = id
    queryToDB(query, reqType, param)
    setTodos(newTodos)
  }

  function handleAddTodo(e) {
    const name = todoNameRef.current.value
    const id = uuidv4()
    const query = { "id": id, "name": name, "complete": false }
    const reqType = 'POST'
    if (name === '') return
    queryToDB(query, reqType)
    setTodos(prevTodos => {
      return [...prevTodos, { id: id, name: name, complete: false}]
    })
    todoNameRef.current.value = null
  }

  function handleClearTodos() {
    
    const query = {ids: todos.filter(todo => todo.complete).map(x => x.id)}
    console.log(query)
    queryToDB(query, "DELETE")

    const newTodos = todos.filter(todo => !todo.complete)
    setTodos(newTodos)
  }

  async function queryToDB(query, reqType, param=null){
    let response
    if (param != null){
      response = await fetch("http://localhost:5001/todos/"+param, {
        method: reqType,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
      });
    }else{
      response = await fetch("http://localhost:5001/todos/", {
        method: reqType,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
      });
    } 
    console.log(response.json());
  }

  return (
    <>
      <TodoList todos={todos} toggleTodo={toggleTodo} />
      <input ref={todoNameRef} type="text" />
      <button onClick={handleAddTodo}>Add Todo</button>
      <button onClick={handleClearTodos}>Clear Complete</button>
      <div>{todos.filter(todo => !todo.complete).length} left to do</div>
    </>
  )
}

export default App