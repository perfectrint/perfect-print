// Shopping Cart

let cart = [];

// Add product to cart
function addToCart(productName, price) {

    cart.push({
        name: productName,
        price: price
    });

    updateCart();

}

// Update cart number
function updateCart() {

    document.getElementById("cartCount").textContent = cart.length;

}
