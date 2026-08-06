alert("SCRIPT IS WORKING!");

// Shopping Cart

let cart = [];

// Add product to cart
function addToCart(productName, price){

    const existing = cart.find(item => item.name === productName);

    if(existing){

        existing.quantity++;

    }else{

        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });

    }

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

       total += item.price * item.quantity;

       cartItems.innerHTML += `
<div style="
padding:15px;
border-bottom:1px solid #ddd;
">

<strong>${item.name}</strong>

<div style="
display:flex;
align-items:center;
gap:10px;
margin:10px 0;
">

<button class="quantity-btn" onclick="decreaseQuantity('${item.name}')">➖</button>

<strong>${item.quantity}</strong>

<button class="quantity-btn" onclick="increaseQuantity('${item.name}')">➕</button>
</div>

<p>$${item.price * item.quantity}</p>

</div>
`;

    });

    cartTotal.textContent = total;

}

function increaseQuantity(productName){

    const item = cart.find(item => item.name === productName);

    if(item){

        item.quantity++;

        updateCart();

    }

}

function decreaseQuantity(productName){

    const item = cart.find(item => item.name === productName);

    if(item){

        item.quantity--;

        if(item.quantity <= 0){

            cart = cart.filter(i => i.name !== productName);

        }

        updateCart();

    }

}
function openCart(){

    document.getElementById("cartPanel").classList.add("open");

}

function closeCart(){

    document.getElementById("cartPanel").classList.remove("open");

}
