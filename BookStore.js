const readline = require("readline-sync");

let bookStore = [
    { BookID:101, name: "Book 1", price: 15, status: "available", quantity: 5 },
    { BookID:102, name: "Book 2", price: 25, status: "available", quantity: 8 },
    { BookID:103, name: "Book 3", price: 20, status: "available", quantity: 10 },
    { BookID:104, name: "Book 4", price: 20, status: "available", quantity: 20 }
];

let cart = [];
let unavailableBooks=[];
let selectedBook=[];

function BookStore() {
    while (true) {
        console.log("1. Display Books\n2. Add Book to Cart\n3. Show Cart\n4. Exit");
        const choice = parseInt(readline.question("Enter your choice: "));

        switch (choice) {
            case 1:
                showAvailableBooks();
                break;
            case 2:
                addBookToCart();
                break;
            case 3:
                showCart();
                break;
            case 4:
                console.log("Thank you for visiting the portal.");
                process.exit();
            default:
                console.log("Invalid choice. Please try again.");
        }
    }
}

function showAvailableBooks() {
    console.log("Available Books:");
    console.log("+----+---------+------------+---------+----------+");
    console.log("| ID | BookID  |   Name     | Price   | Quantity |");
    console.log("+----+---------+------------+---------+----------+");
    
    bookStore.forEach((book, index) => {
        if (book.status === 'available') {
            console.log(`| ${index+1}  | ${padString(book.BookID.toString(), 7)} | ${padString(book.name, 10)} | $${padString(book.price.toFixed(2), 6)} | ${padString(book.quantity.toString(), 8)} |`);
        }
    });
    
    console.log("+----+---------+------------+---------+----------+");
    
    }

function addBookToCart() {
        showAvailableBooks();
        const bookId = readline.question("Enter the ID of the book you want to add to the cart: ");
    
        for (let i = 0; i < bookStore.length; i++) {
            if (bookStore[i].BookID == bookId) {
                selectedBook = bookStore[i];
            }
        }
    
        if (selectedBook && selectedBook.status === "available") {
            const quantity = parseInt(readline.question(`Enter the quantity of ${selectedBook.name} you want to add to the cart: `));
    
            if (isNaN(quantity) || quantity <= 0 || quantity > selectedBook.quantity) {
                console.log("Invalid quantity. Please try again.");
                return;
            }
            let existingCartItem = cart.find((item) => item.BookID == bookId);
            if (existingCartItem !== undefined) {
                existingCartItem.quantity += quantity;
                existingCartItem.totalPrice += selectedBook.price * quantity;
            } else {
                cart.push({
                    BookID: selectedBook.BookID,
                    name: selectedBook.name,
                    price: selectedBook.price,
                    quantity: quantity,
                    totalPrice: selectedBook.price * quantity
                });
            }
    
            // Update the book's quantity
            selectedBook.quantity -= quantity;
    
            console.log(`${selectedBook.name} has been added to the cart.\n`);
            
            if (selectedBook.quantity === 0) {
                selectedBook.status = "unavailable";
                unavailableBooks.push(selectedBook);
                showUnavailable();
            }
    
        } else {
            console.log("Invalid selection or insufficient quantity. Please try again.");
        }
    }
    
function showCart() {
    if (cart.length === 0) {
        console.log("Your cart is empty.\n");
    } else {
        console.log("Your Cart:");
        console.log("+----+--------+-----------+--------+-----------+");
        console.log("| ID | BookID |   Name    | Price  | Quantity  |"); 
        console.log("+----+--------+-----------+--------+-----------+");
        cart.forEach((book, index) => {
            console.log(`| ${index + 1}  | ${book.BookID}    | ${padString(book.name, 6)}    | ${book.price}     |  ${book.quantity}        |`);
        });
        console.log("+----+--------+-----------+--------+-----------+");
        const totalCartValue = cart.reduce((total, book) => total + book.totalPrice, 0);
        console.log(`Total Cart Value: $${totalCartValue}\n`);

        const userChoice = parseInt(readline.question("Enter your choice :\n1. Update quantity\n2. Remove item\n3. Continue:\n"));

        switch (userChoice) {
            case 1:
                const updateItemId = parseInt(readline.question("Enter the ID of the book you want to update: "));
                const newQuantity = parseInt(readline.question("Enter the updated quantity: "));
                updateCartItemQuantity(updateItemId, newQuantity)
                break;
        
            case 2:
                const bookIdToDelete = parseInt(readline.question("Enter the ID of the book you want to remove: "));
                removeBookInCart(bookIdToDelete);

            case 3:
                return 0;
        
            default:
                console.log("Invalid choice. Please enter a valid option.");
                break;
        }
        
        }
        
}


function updateCartItemQuantity(bookId, newQuantity) {
    const cartObj = cart.find((item) => item.BookID === bookId);
    const bookObj = bookStore.find((item) => item.BookID === bookId);

    if (bookObj && cartObj) {
        if (newQuantity > 0 && newQuantity <= bookObj.quantity + cartObj.quantity) {
            // Update book quantity and total price based on the new quantity
            bookObj.quantity += (cartObj.quantity - newQuantity);
            bookObj.totalPrice -= cartObj.totalPrice;

            // Update cart item quantity and total price
            cartObj.quantity = newQuantity;
            cartObj.totalPrice = bookObj.price * newQuantity;

            // Update total values in the cart
            cart.totalPrice -= cartObj.totalPrice;
            cart.totalPrice += bookObj.price * newQuantity;

            // Update book status if needed
            if (bookObj.quantity > 0) {
                bookObj.status = "available";
                unavailableBooks = unavailableBooks.filter((ele) => ele.BookID !== bookId);
            } else {
                bookObj.status = "unavailable";
                unavailableBooks.push(bookObj);
                showUnavailable()
            }

            console.log("\nCart is Updated!");
        } else {
            console.log("\nInvalid Quantity Entered or Quantity Exceeds Available Stock!!");
        }
    } else {
        console.log("\nInvalid Book ID");
    }
}

function removeBookInCart(bookIdToDelete) {
        console.log(bookStore)
        const cartObj = cart.find((ele) => ele.BookID === bookIdToDelete);
        const bookObj = bookStore.find((ele) => ele.BookID === bookIdToDelete);

        if (cart.some((item) => item.BookID === bookIdToDelete)) {
            console.log(selectedBook)
            bookObj.quantity += cartObj.quantity;
            bookObj.totalPrice -= cartObj.totalPrice;
            console.log(selectedBook)
            if (bookObj && bookObj.quantity > 0) {
                bookObj.status = "available";
                unavailableBooks = unavailableBooks.filter((ele) => ele.BookID !== bookIdToDelete);
            }

            cart = cart.filter((ele) => ele.BookID !== bookIdToDelete);

            console.log(`Removed items with Book ID ${bookIdToDelete} from the cart.\n`);
        } else {
            console.log(`Book with ID ${bookIdToDelete} not found in the cart.\n`);
        }
}

function showUnavailable() {
    console.log("Unavailable Books:");
    console.log("+---------+-----------+----------------------+-------+");
    console.log("| BookID  |   Name    |        Price         | Status|");
    console.log("+---------+-----------+----------------------+-------+");

    for (let book of unavailableBooks) {
        console.log(`| ${padString(book.BookID.toString(), 8)} | ${padString(book.name, 7)} | $${padString(book.price.toFixed(2), 15)} | ${padString(book.status, 6)} |`);
    }

    console.log("+---------+-----------+----------------------+-------+");
}

function padString(str, length) {
    return str.padEnd(length);
}

BookStore();