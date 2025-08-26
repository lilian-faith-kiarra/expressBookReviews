const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Check if the username is valid (exists in our records)
  const user = users.find(user => user.username === username);
  return user !== undefined;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Check if username and password match the one we have in records
  const user = users.find(user => user.username === username && user.password === password);
  return user !== undefined;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Login failed",
      error: "Username and password are required"
    });
  }
  
  // Check if user exists and credentials are valid
  if (authenticatedUser(username, password)) {
    // Generate JWT token
    const token = jwt.sign(
      { username: username },
      'your-secret-key', // Replace with your actual secret key
      { expiresIn: '1h' }
    );
    
    return res.status(200).json({
      message: "Login successful",
      username: username,
      token: token
    });
  } else {
    return res.status(401).json({
      message: "Login failed",
      error: "Invalid username or password"
    });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const username = req.user.username; // Get username from JWT token
  
  // Check if review is provided
  if (!review) {
    return res.status(400).json({
      message: "Review operation failed",
      error: "Review text is required"
    });
  }
  
  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({
      message: "Review operation failed",
      error: `Book with ISBN ${isbn} not found`
    });
  }
  
  // Initialize reviews object if it doesn't exist
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }
  
  // Add or modify the review for the current user
  books[isbn].reviews[username] = review;
  
  return res.status(200).json({
    message: "Review added/modified successfully",
    isbn: isbn,
    title: books[isbn].title,
    username: username,
    review: review
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username; // Get username from JWT token
  
  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({
      message: "Review deletion failed",
      error: `Book with ISBN ${isbn} not found`
    });
  }
  
  // Check if the user has a review for this book
  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({
      message: "Review deletion failed",
      error: `No review found for user ${username} on book with ISBN ${isbn}`
    });
  }
  
  // Delete the user's review
  delete books[isbn].reviews[username];
  
  return res.status(200).json({
    message: "Review deleted successfully",
    isbn: isbn,
    title: books[isbn].title,
    username: username
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
