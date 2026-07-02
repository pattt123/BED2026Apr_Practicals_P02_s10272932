// Get references to the elements
const editBookForm = document.getElementById("editBookForm");
const loadingMessageDiv = document.getElementById("loadingMessage"); // Element to show loading state
const messageDiv = document.getElementById("message"); // Element to display messages (success/error)
const bookIdInput = document.getElementById("bookId"); // Hidden input to store the book ID
const editTitleInput = document.getElementById("editTitle"); // Input for the book title
const editAuthorInput = document.getElementById("editAuthor"); // Input for the book author

// Base URL for the API.
const apiBaseUrl = "http://localhost:3000";

// Function to get book ID from URL query parameter (e.g., edit.html?id=1)
function getBookIdFromUrl() {
  const params = new URLSearchParams(window.location.search); // Get URL query parameters
  return params.get("id"); // Return the value of the 'id' parameter
}

// Function to fetch existing book data from the API based on ID
async function fetchBookData(bookId) {
  try {
    // Make a GET request to the API endpoint for a specific book
    const response = await fetch(`${apiBaseUrl}/books/${bookId}`);

    // Check if the HTTP response status is not OK (e.g., 404, 500)
    if (!response.ok) {
      // Attempt to read error body if available (assuming JSON), otherwise use status text
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      // Throw an error with status and message
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorBody.message}`
      );
    }

    // Parse the JSON response body into a JavaScript object
    const book = await response.json();
    return book; // Return the fetched book object
  } catch (error) {
    // Catch any errors during the fetch or processing
    console.error("Error fetching book data:", error);
    // Display an error message to the user
    messageDiv.textContent = `Failed to load book data: ${error.message}`;
    messageDiv.style.color = "red";
    loadingMessageDiv.textContent = ""; // Hide loading message if it was shown
    return null; // Indicate that fetching failed
  }
}

// Function to populate the form fields with the fetched book data
function populateForm(book) {
  bookIdInput.value = book.id; // Store the book ID in the hidden input
  editTitleInput.value = book.title; // Set the title input value
  editAuthorInput.value = book.author; // Set the author input value
  loadingMessageDiv.style.display = "none"; // Hide the loading message
  editBookForm.style.display = "block"; // Show the edit form
}

// --- Code to run when the page loads ---

// Get the book ID from the URL when the page loads
const bookIdToEdit = getBookIdFromUrl();

// Check if a book ID was found in the URL
if (bookIdToEdit) {
  // If an ID exists, fetch the book data and then populate the form
  fetchBookData(bookIdToEdit).then((book) => {
    if (book) {
      // If book data was successfully fetched, populate the form
      populateForm(book);
    } else {
      // Handle the case where fetchBookData returned null (book not found or error)
      loadingMessageDiv.textContent = "Book not found or failed to load.";
      messageDiv.textContent = "Could not find the book to edit.";
      messageDiv.style.color = "red";
    }
  });
} else {
  // Handle the case where no book ID was provided in the URL
  loadingMessageDiv.textContent = "No book ID specified for editing.";
  messageDiv.textContent =
    "Please provide a book ID in the URL (e.g., edit.html?id=1).";
  messageDiv.style.color = "orange";
}

// --- Start of code for learners to complete (Form Submission / PUT Request) ---

// Add an event listener for the form submission (for the Update operation)
editBookForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent the default browser form submission
  // Clear previous messages and show loading state
  messageDiv.textContent = "";
  loadingMessageDiv.textContent = "Updating book...";

  // Collect updated data from form fields
  const updatedTitle = editTitleInput.value.trim();
  const updatedAuthor = editAuthorInput.value.trim();

  // Get the book ID from the hidden input or the URL-derived value
  const id = bookIdInput.value || bookIdToEdit;

  // Basic client-side validation
  if (!id) {
    loadingMessageDiv.textContent = "";
    messageDiv.style.color = "red";
    messageDiv.textContent = "Missing book ID. Cannot update.";
    return;
  }

  if (!updatedTitle || !updatedAuthor) {
    loadingMessageDiv.textContent = "";
    messageDiv.style.color = "red";
    messageDiv.textContent = "Title and author are required.";
    return;
  }

  const payload = {
    title: updatedTitle,
    author: updatedAuthor,
  };

  try {
    const response = await fetch(`${apiBaseUrl}/books/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      // Success (commonly 200)
      const updatedBook = await response.json().catch(() => null);
      messageDiv.style.color = "green";
      messageDiv.textContent = "Book updated successfully.";
      // Redirect back to index after a short delay
      setTimeout(() => {
        window.location.href = "index.html";
      }, 800);
    } else if (response.status === 400) {
      // Validation error: show server-provided message if available
      const err = await response.json().catch(() => null);
      messageDiv.style.color = "red";
      messageDiv.textContent = (err && err.message) || "Validation error. Check input.";
    } else if (response.status === 404) {
      messageDiv.style.color = "red";
      messageDiv.textContent = "Book not found (it may have been deleted).";
    } else {
      // Other server errors
      const errText = await response.text().catch(() => "");
      messageDiv.style.color = "red";
      messageDiv.textContent = `Error updating book: ${response.status} ${response.statusText} ${errText}`;
    }
  } catch (error) {
    console.error("Error during update request:", error);
    messageDiv.style.color = "red";
    messageDiv.textContent = `Failed to update book: ${error.message}`;
  } finally {
    loadingMessageDiv.textContent = "";
  }
});

// --- End of code for learners to complete ---