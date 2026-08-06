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

    // Update cart number
    document.getElementById("cartCount").textContent = cart.length;

    // Get cart elements
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    // Clear old items
    cartItems.innerHTML = "";

    let total = 0;

    // Empty cart
    if(cart.length === 0){

        cartItems.innerHTML = "<p>Your cart is empty.</p>";
        cartTotal.textContent = "0";
        return;

    }

    // Add each product
    cart.forEach(item =>{

        total += item.price;

        cartItems.innerHTML += `
            <div style="padding:12px;border-bottom:1px solid #ddd;">
                <strong>${item.name}</strong><br>
                $${item.price}
            </div>
        `;

    });

    cartTotal.textContent = total;

}

}
