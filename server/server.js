require('dotenv').config()
const PORT = process.env.PORT ?? 8000
const express = require('express')
const app = express()
const { v4: uuidv4 } = require('uuid');
const { fetchItems, queryItems, createItem, editItem, deleteItem, signUp, login } = require('./dynamoDB')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utilities');
app.use(express.json())

app.use(cors({
  origin: "*",
}))

//Change all the lines in server.js before push for deployment
//There are two ways to implement the backend
//1. using authenticateToken which contains the data of the user 
//2. using react cookies
// Try to Push all the lines of code 

// get queryTodos
// app.get('/todos/:userEmail', async (req, res) => {
//   const { userEmail } = req.params;
//   try {
//     const todos = await queryItems(userEmail);
//     console.log(todos)
//     res.json(todos)
//   } catch (err) {
//     console.error(err)
//   }
// })

//Explain logic: How req.user data works in utils: autheticationToken (middleware)
//How to use the perfect way to get the data of the user from the backend to the frontend 
//Decode the structure how to get the meta data in the correct form
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;
  // const user_email = user.Items[0].email;
  const user_email = user.email;
  console.log('user for get all notes', user)
  // console.log('user_email for Get All Notes', user_email)

  try {
    const notes = await queryItems(user_email);
    if (!notes) {
      return res.status(400).json({ error: true, message: "User email is required" })
    }

    return res.json({
      error: false,
      notes,
      message: "All notes retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});
//create a todo
// app.post('/todos', async (req, res) => {
//   const { user_email, title, progress, date } = req.body;
//   const id = uuidv4();
//   try {
//     const newTodo = await createItem({ id, user_email, title, progress, date });
//     console.log(newTodo)
//     res.json(newTodo)
//   } catch (error) {
//     console.log(error)
//   }
// })
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })sdad
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, progress, date } = req.body;
  // const { user } = req.user;
  const { user } = req.user

  // const user_email = user.Items[0].email
  const user_email = user.email
  console.log('user_email', user_email)
  const id = uuidv4();

  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" });
  }
  if (!date) {
    return res.status(400).json({ error: true, message: "Date is required" });
  }
  if (!user_email) {
    return res.status(400).json({ error: true, message: "User email is required" });
  }
  console.log({ Test: user_email, title, progress, date })
  try {
    const note = await createItem(
      id,
      user_email,
      title,
      progress,
      date,
    );
    return res.json({
      error: false,
      note,
      message: "Note added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//edit Data
//Method 1
//conventional way to detect ID
// app.put('/todos/:id', async (req, res) => {
//   const { id } = req.params;
//   const { user_email, title, progress, date } = req.body;
//   try {
//     const editTodo = await editItem(id, user_email, title, progress, date);
//     res.json(editTodo)
//   } catch (error) {
//     console.log(error)
//   }
// })


//using.......authenticationtoken which carries the data of user,,,
//Method 2: using authenticationToken (Previsuly using Cookiees vs Now Token vs Future:Oauth)
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;
  const { title, progress, date } = req.body;
  const user_email = user.email
  console.log('noteId', noteId)
  try {
    console.log({ Test: noteId, user_email, title, progress, date })
    const note = await editItem({ noteId, user_email, title, progress, date });
    console.log('note', note)
    
    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});
// ************************************************
//Method 1: Deleting data,
//delete Data
// app.delete('/todos/:id', async (req, res) => {
//   const { id } = req.params;
//   const { user_email } = req.body
//   try {
//     const deleteTodo = await deleteItem(id, user_email);
//     res.json(deleteTodo)
//   } catch (error) {
//     console.log(error)
//   }
// })
//Method 2: Deleting data,
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;
  const user_email = user.email

  try {
    const note = await deleteItem(noteId, user_email);
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    return res.json({
      error: false,
      note,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
})

//signup:
// app.post('/signup', async (req, res) => {
//   const { email, password } = req.body
//   const salt = bcrypt.genSaltSync(10)
//   const hashedPassword = bcrypt.hashSync(password, salt)
//   try {
//     const signup = await signUp(email, hashedPassword)
//     const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' })
//     res.json({email, token})
//   } catch (error) {
//     console.log(error)
//   }
// })


//Func to get Implemented soo....
// const isUser = await signUp(email, password)
// if (isUser) {
//   return res.json({
//     error: true,
//     message: "User already exist",
//   });
// }
app.post("/create-account", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }
  try {
    const user = await signUp(email, password)
    // const user = { user: userInfo }
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });
    return res.json({
      error: false,
      user,
      accessToken,
      message: "Registration Successful",
    });
  } catch (error) {
    console.log(error)
  }


});

// if(userInfo){
//   const user = {user:userInfo.Items[0]}
//   console.log('create-account', user)
//   const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
//     expiresIn: "36000m",
//   });
//   return res.json({
//     error: false,
//     user,
//     accessToken,
//     message: "Registration Successful",
//   });
// }else {
//   return res.status(400).json({
//     error: true,
//     message: "Invalid Credentials",
//   });
// }

//*************************************************** */
//Login
//Method 1
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body
//   try {
//     const user = await login(email)
//     const success = await bcrypt.compare(password, user.Items[0].hashedPassword)
//     const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' })
//     // if (success) {
//     //   res.json({ email: user.Items[0].email, token })
//     // }
//     return success ? res.json({ email: user.Items[0].email, token }) : res.status(400).json({ error: "Invalid Login" })
//   } catch (error) {
//     console.log(error)
//   }
// })
//Method 2
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // if (!email) {
  //   return res.status(400).json({ message: "Email is required" });
  // }
  // if (!password) {
  //   return res.status(400).json({ message: "Password is required" });
  // }
  //else can write like this
  //if (!email || !password) {
  //   return res.status(400).json({ error: true, message: "Email and password are required" });

  const user = await login(email)
  console.log('user', user)

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (user.email === email && user.hashedPassword === password) {
    // const user = { user: userInfo };
    // console.log('login token',user)
    // const user = { user: userInfo }
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });

    return res.json({
      error: false,
      message: "Login Successful",
      user,
      accessToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Invalid Credentials",
    });
  }
});

//***************************************************************************
// Helper function to generate JWT token
// function generateToken(user, secret, expiresIn = "36000m") {
//   const payload = {
//     user: {
//       email: user.email,
//       id: user.id // Assuming 'id' is part of the user object
//     }
//   };
//   return jwt.sign(payload, secret, { expiresIn });
// }

// // Account creation endpoint
// app.post("/create-account", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email) {
//     return res.status(400).json({ error: true, message: "Email is required" });
//   }

//   if (!password) {
//     return res.status(400).json({ error: true, message: "Password is required" });
//   }

//   const userInfo = await signUp(email, password);
//   if (userInfo) {
//     const accessToken = generateToken({ email: userInfo.email, id: userInfo.id }, process.env.ACCESS_TOKEN_SECRET);
//     return res.json({
//       error: false,
//       user: userInfo,
//       accessToken,
//       message: "Registration Successful",
//     });
//   } else {
//     return res.status(400).json({
//       error: true,
//       message: "Invalid Credentials",
//     });
//   }
// });

// // Login endpoint
//Method 3
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email) {
//     return res.status(400).json({ message: "Email is required" });
//   }

//   if (!password) {
//     return res.status(400).json({ message: "Password is required" });
//   }

//   const userInfo = await login(email);
//   if (!userInfo) {
//     return res.status(400).json({ message: "User not found" });
//   }

//   if (userInfo.Items[0].email === email && userInfo.Items[0].hashedPassword === password) {
//     const accessToken = generateToken({email}, process.env.ACCESS_TOKEN_SECRET);
//     return res.json({
//       error: false,
//       message: "Login Successful",
//       email,
//       accessToken,
//     });
//   } else {
//     return res.status(400).json({
//       error: true,
//       message: "Invalid Credentials",
//     });
//   }
// });

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
