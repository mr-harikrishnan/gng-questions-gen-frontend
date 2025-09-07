import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import QuestionsList from './pages/QuestionListPage/QuestionList'
import CreateForm from './pages/CreateForm/createform'
import EditForm from './pages/EditForm/editform'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login></Login>}></Route>
        <Route path='/register' element={<Register></Register>}></Route>
        <Route path='/questions' element={<QuestionsList></QuestionsList>}></Route>
        <Route path='/createform' element={<CreateForm></CreateForm>}></Route>
        <Route path='/editform/:id' element={<EditForm></EditForm>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App