const readline = require("readline-sync");

let bookStore = [
    { name: "Book 1", price: 15, status: "available", quantity: 5 },
    { name: "Book 2", price: 25, status: "available", quantity: 8 },
    { name: "Book 3", price: 20, status: "available", quantity: 10 },
    { name: "Book 4", price: 20, status: "unavailable", quantity: 0 }
];

let cart = [];

function main() {
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
    console.log("+----+----------------------+-------+----------+");
    console.log("| ID |        Name          | Price | Quantity |");
    console.log("+----+----------------------+-------+----------+");

    bookStore.forEach((book, index) => {
        if (book.status === 'available') {
            console.log(`| ${index + 1}  | ${padString(book.name, 20)} | $${padString(book.price.toFixed(2), 5)} | ${padString(book.quantity.toString(), 8)}|`);
        }
    });

    console.log("+----+----------------------+-------+----------+");
}

function addBookToCart() {
    showAvailableBooks();
    const bookIndex = parseInt(readline.question("Enter the ID of the book you want to add to the cart: ")) - 1;

    if (isNaN(bookIndex) || bookIndex < 0 || bookIndex >= bookStore.length) {
        console.log("Invalid book ID. Please try again.");
        return;
    }

    const selectedBook = bookStore[bookIndex];

    if (selectedBook.status === "available" && selectedBook.quantity > 0) {
        const quantity = parseInt(readline.question(`Enter the quantity of ${selectedBook.name} you want to add to the cart: `));

        if (isNaN(quantity) || quantity <= 0 || quantity > selectedBook.quantity) {
            console.log("Invalid quantity. Please try again.");
            return;
        }

        cart.push({
            name: selectedBook.name,
            price: selectedBook.price,
            quantity: quantity,
            totalPrice: selectedBook.price * quantity
        });

        selectedBook.quantity -= quantity;

        console.log(`${selectedBook.name} has been added to the cart.\n`);
    } else {
        console.log("Invalid selection or insufficient quantity. Please try again.");
    }
}

function showCart() {
    if (cart.length === 0) {
        console.log("Your cart is empty.\n");
    } else {
        console.log("Your Cart:");
        cart.forEach(book => {
            console.log(`Name: ${book.name}, Price: $${book.price}, Quantity: ${book.quantity}, Total Price: $${book.totalPrice}`);
        });

        const totalCartValue = cart.reduce((total, book) => total + book.totalPrice, 0);
        console.log(`Total Cart Value: $${totalCartValue}\n`);
    }
}

function padString(str, length) {
    return str.padEnd(length);
}

main();
