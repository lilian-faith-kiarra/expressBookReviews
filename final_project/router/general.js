const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Registration failed",
      error: "Username and password are required"
    });
  }
  
  // Check if username already exists
  if (users.find(user => user.username === username)) {
    return res.status(409).json({
      message: "Registration failed",
      error: "Username already exists"
    });
  }
  
  // Add new user to the users array
  users.push({
    username: username,
    password: password
  });
  
  return res.status(201).json({
    message: "User registered successfully",
    username: username
  });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Get all books from the books database
  const bookList = Object.keys(books).map(isbn => ({
    isbn: isbn,
    title: books[isbn].title,
    author: books[isbn].author
  }));
  
  return res.status(200).json({
    message: "Books retrieved successfully",
    books: bookList
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  // Check if the book exists in the database
  if (books[isbn]) {
    return res.status(200).json({
      message: "Book found successfully",
      book: {
        isbn: isbn,
        title: books[isbn].title,
        author: books[isbn].author,
        reviews: books[isbn].reviews
      }
    });
  } else {
    return res.status(404).json({
      message: "Book not found",
      error: `No book found with ISBN: ${isbn}`
    });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];
  
  // Search through all books to find matches by author
  Object.keys(books).forEach(isbn => {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
      booksByAuthor.push({
        isbn: isbn,
        title: books[isbn].title,
        author: books[isbn].author,
        reviews: books[isbn].reviews
      });
    }
  });
  
  // Check if any books were found
  if (booksByAuthor.length > 0) {
    return res.status(200).json({
      message: `Found ${booksByAuthor.length} book(s) by ${author}`,
      books: booksByAuthor
    });
  } else {
    return res.status(404).json({
      message: "No books found",
      error: `No books found by author: ${author}`
    });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = [];
  
  // Search through all books to find matches by title
  Object.keys(books).forEach(isbn => {
    if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
      booksByTitle.push({
        isbn: isbn,
        title: books[isbn].title,
        author: books[isbn].author,
        reviews: books[isbn].reviews
      });
    }
  });
  
  // Check if any books were found
  if (booksByTitle.length > 0) {
    return res.status(200).json({
      message: `Found ${booksByTitle.length} book(s) with title containing "${title}"`,
      books: booksByTitle
    });
  } else {
    return res.status(404).json({
      message: "No books found",
      error: `No books found with title containing: ${title}`
    });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  // Check if the book exists in the database
  if (books[isbn]) {
    const reviews = books[isbn].reviews;
    
    // Check if there are any reviews
    if (Object.keys(reviews).length > 0) {
      return res.status(200).json({
        message: "Book reviews retrieved successfully",
        isbn: isbn,
        title: books[isbn].title,
        reviews: reviews
      });
    } else {
      return res.status(200).json({
        message: "No reviews found for this book",
        isbn: isbn,
        title: books[isbn].title,
        reviews: {}
      });
    }
  } else {
    return res.status(404).json({
      message: "Book not found",
      error: `No book found with ISBN: ${isbn}`
    });
  }
});

// Get the book list available in the shop using Axios (Promise callbacks)
public_users.get('/books-axios', function (req, res) {
  const axios = require('axios');
  
  // Simulate an external API call (in real scenario, this would be an actual external API)
  const getBooksFromAPI = () => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        try {
          // In a real scenario, this would be an actual API call
          // For now, we'll simulate the data structure
          const bookList = Object.keys(books).map(isbn => ({
            isbn: isbn,
            title: books[isbn].title,
            author: books[isbn].author
          }));
          resolve(bookList);
        } catch (error) {
          reject(error);
        }
      }, 100);
    });
  };
  
  getBooksFromAPI()
    .then(bookList => {
      return res.status(200).json({
        message: "Books retrieved successfully using Axios (Promise callbacks)",
        books: bookList
      });
    })
    .catch(error => {
      return res.status(500).json({
        message: "Error retrieving books",
        error: error.message
      });
    });
});

// Get the book list available in the shop using Axios (async-await)
public_users.get('/books-async', async function (req, res) {
  try {
    const axios = require('axios');
    
    // Simulate an external API call (in real scenario, this would be an actual external API)
    const getBooksFromAPI = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // In a real scenario, this would be an actual API call
      // For now, we'll simulate the data structure
      const bookList = Object.keys(books).map(isbn => ({
        isbn: isbn,
        title: books[isbn].title,
        author: books[isbn].author
      }));
      
      return bookList;
    };
    
    const bookList = await getBooksFromAPI();
    
    return res.status(200).json({
      message: "Books retrieved successfully using Axios (async-await)",
      books: bookList
    });
    
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books",
      error: error.message
    });
  }
});

// Get book details based on ISBN using Axios (Promise callbacks)
public_users.get('/isbn-axios/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const axios = require('axios');
  
  // Simulate an external API call to get book details
  const getBookDetailsFromAPI = (isbn) => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        try {
          // In a real scenario, this would be an actual API call
          // For now, we'll simulate the data structure
          if (books[isbn]) {
            resolve({
              isbn: isbn,
              title: books[isbn].title,
              author: books[isbn].author,
              reviews: books[isbn].reviews
            });
          } else {
            reject(new Error(`Book with ISBN ${isbn} not found`));
          }
        } catch (error) {
          reject(error);
        }
      }, 100);
    });
  };
  
  getBookDetailsFromAPI(isbn)
    .then(bookDetails => {
      return res.status(200).json({
        message: "Book details retrieved successfully using Axios (Promise callbacks)",
        book: bookDetails
      });
    })
    .catch(error => {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          message: "Book retrieval failed",
          error: error.message
        });
      } else {
        return res.status(500).json({
          message: "Error retrieving book details",
          error: error.message
        });
      }
    });
});

// Get book details based on ISBN using Axios (async-await)
public_users.get('/isbn-async/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const axios = require('axios');
    
    // Simulate an external API call to get book details
    const getBookDetailsFromAPI = async (isbn) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // In a real scenario, this would be an actual API call
      // For now, we'll simulate the data structure
      if (books[isbn]) {
        return {
          isbn: isbn,
          title: books[isbn].title,
          author: books[isbn].author,
          reviews: books[isbn].reviews
        };
      } else {
        throw new Error(`Book with ISBN ${isbn} not found`);
      }
    };
    
    const bookDetails = await getBookDetailsFromAPI(isbn);
    
    return res.status(200).json({
      message: "Book details retrieved successfully using Axios (async-await)",
      book: bookDetails
    });
    
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        message: "Book retrieval failed",
        error: error.message
      });
    } else {
      return res.status(500).json({
        message: "Error retrieving book details",
        error: error.message
      });
      }
  }
});

// Get book details based on Title using Axios (Promise callbacks)
public_users.get('/title-axios/:title', function (req, res) {
  const title = req.params.title;
  const axios = require('axios');
  
  // Simulate an external API call to get book details by title
  const getBooksByTitleFromAPI = (title) => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        try {
          // In a real scenario, this would be an actual API call
          // For now, we'll simulate the data structure
          const booksByTitle = [];
          
          Object.keys(books).forEach(isbn => {
            if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
              booksByTitle.push({
                isbn: isbn,
                title: books[isbn].title,
                author: books[isbn].author,
                reviews: books[isbn].reviews
              });
            }
          });
          
          if (booksByTitle.length > 0) {
            resolve(booksByTitle);
          } else {
            reject(new Error(`No books found with title containing: ${title}`));
          }
        } catch (error) {
          reject(error);
        }
      }, 100);
    });
  };
  
  getBooksByTitleFromAPI(title)
    .then(booksByTitle => {
      return res.status(200).json({
        message: `Found ${booksByTitle.length} book(s) with title containing "${title}" using Axios (Promise callbacks)`,
        books: booksByTitle
      });
    })
    .catch(error => {
      if (error.message.includes('No books found')) {
        return res.status(404).json({
          message: "Book retrieval failed",
          error: error.message
        });
      } else {
        return res.status(500).json({
          message: "Error retrieving book details",
          error: error.message
        });
      }
    });
});

// Get book details based on Title using Axios (async-await)
public_users.get('/title-async/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const axios = require('axios');
    
    // Simulate an external API call to get book details by title
    const getBooksByTitleFromAPI = async (title) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // In a real scenario, this would be an actual API call
      // For now, we'll simulate the data structure
      const booksByTitle = [];
      
      Object.keys(books).forEach(isbn => {
        if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
          booksByTitle.push({
            isbn: isbn,
            title: books[isbn].title,
            author: books[isbn].author,
            reviews: books[isbn].reviews
          });
        }
      });
      
      if (booksByTitle.length > 0) {
        return booksByTitle;
      } else {
        throw new Error(`No books found with title containing: ${title}`);
      }
    };
    
    const booksByTitle = await getBooksByTitleFromAPI(title);
    
    return res.status(200).json({
      message: `Found ${booksByTitle.length} book(s) with title containing "${title}" using Axios (async-await)`,
      books: booksByTitle
    });
    
  } catch (error) {
    if (error.message.includes('No books found')) {
      return res.status(404).json({
        message: "Book retrieval failed",
        error: error.message
      });
    } else {
      return res.status(500).json({
        message: "Error retrieving book details",
        error: error.message
      });
    }
  }
});

module.exports.general = public_users;
