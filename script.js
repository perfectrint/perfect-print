/* =========================================================
   PERFECT PRINTS
   Professional Shopping Cart + Search
   ========================================================= */

let cart = [];


/* =========================================================
   LOAD SAVED CART
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const savedCart = localStorage.getItem("perfectPrintsCart");

    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (error) {
            cart = [];
        }
    }

    updateCart();
    setupSearch();

});


/* =========================================================
   SAVE CART
   ========================================================= */

function saveCart() {

    localStorage.setItem(
        "perfectPrintsCart",
        JSON.stringify(cart)
    );

}


/* =========================================================
   ADD PRODUCT TO CART
   ========================================================= */

function addToCart(productName, price) {

    const existingProduct = cart.find(
        item => item.name === productName
    );

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            name: productName,
            price: Number(price),
            quantity: 1
        });

    }

    saveCart();
    updateCart();

    showCartMessage(productName);

}


/* =========================================================
   UPDATE CART
   ========================================================= */

function updateCart() {

    const cartCount = document.getElementById("cartCount");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartCount || !cartItems || !cartTotal) {
        return;
    }


    /* ---------- CART ITEM COUNT ---------- */

    let totalItems = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
    });

    cartCount.textContent = totalItems;


    /* ---------- EMPTY CART ---------- */

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div style="
                text-align:center;
                padding:50px 20px;
                color:#777;
            ">
                <div style="font-size:50px;">🛒</div>

                <h3 style="margin:15px 0;">
                    Your cart is empty
                </h3>

                <p>
                    Add some awesome 3D prints!
                </p>
            </div>
        `;

        cartTotal.textContent = "0.00";

        return;
    }


    /* ---------- BUILD CART ---------- */

    let total = 0;

    cartItems.innerHTML = "";


    cart.forEach((item, index) => {

        const itemTotal =
            Number(item.price) * Number(item.quantity);

        total += itemTotal;


        const cartItem = document.createElement("div");

        cartItem.style.cssText = `
            padding:18px 0;
            border-bottom:1px solid #e5e5e5;
        `;


        cartItem.innerHTML = `

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:flex-start;
                gap:15px;
            ">

                <div>

                    <strong style="
                        font-size:16px;
                        color:#222;
                    ">
                        ${item.name}
                    </strong>

                    <p style="
                        margin:5px 0;
                        color:#777;
                        font-size:14px;
                    ">
                        $${Number(item.price).toFixed(2)} each
                    </p>

                </div>


                <button
                    onclick="removeFromCart(${index})"
                    style="
                        border:none;
                        background:none;
                        color:#ef4444;
                        font-size:18px;
                        cursor:pointer;
                    "
                    title="Remove item"
                >
                    🗑️
                </button>

            </div>


            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                margin-top:12px;
            ">

                <div style="
                    display:flex;
                    align-items:center;
                    gap:8px;
                ">

                    <button
                        class="quantity-btn"
                        onclick="decreaseQuantity(${index})"
                    >
                        −
                    </button>


                    <strong style="
                        min-width:25px;
                        text-align:center;
                    ">
                        ${item.quantity}
                    </strong>


                    <button
                        class="quantity-btn"
                        onclick="increaseQuantity(${index})"
                    >
                        +
                    </button>

                </div>


                <strong style="
                    color:#6d28d9;
                    font-size:17px;
                ">
                    $${itemTotal.toFixed(2)}
                </strong>

            </div>

        `;


        cartItems.appendChild(cartItem);

    });


    /* ---------- UPDATE TOTAL ---------- */

    cartTotal.textContent = total.toFixed(2);

}


/* =========================================================
   INCREASE QUANTITY
   ========================================================= */

function increaseQuantity(index) {

    if (!cart[index]) {
        return;
    }

    cart[index].quantity++;

    saveCart();
    updateCart();

}


/* =========================================================
   DECREASE QUANTITY
   ========================================================= */

function decreaseQuantity(index) {

    if (!cart[index]) {
        return;
    }

    cart[index].quantity--;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    saveCart();
    updateCart();

}


/* =========================================================
   REMOVE PRODUCT
   ========================================================= */

function removeFromCart(index) {

    if (!cart[index]) {
        return;
    }

    cart.splice(index, 1);

    saveCart();
    updateCart();

}


/* =========================================================
   CLEAR CART
   ========================================================= */

function clearCart() {

    cart = [];

    saveCart();
    updateCart();

}


/* =========================================================
   OPEN CART
   ========================================================= */

function openCart() {

    const cartPanel =
        document.getElementById("cartPanel");

    if (cartPanel) {

        cartPanel.classList.add("open");

    }

}


/* =========================================================
   CLOSE CART
   ========================================================= */

function closeCart() {

    const cartPanel =
        document.getElementById("cartPanel");

    if (cartPanel) {

        cartPanel.classList.remove("open");

    }

}


/* =========================================================
   SEARCH PRODUCTS
   ========================================================= */

function setupSearch() {

    const searchInput =
        document.getElementById("searchInput");

    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        function () {

            const searchTerm =
                searchInput.value
                    .toLowerCase()
                    .trim();


            const products =
                document.querySelectorAll(".card");


            let visibleProducts = 0;


            products.forEach(product => {

                const productText =
                    product.textContent.toLowerCase();


                if (
                    productText.includes(searchTerm)
                ) {

                    product.style.display = "";

                    visibleProducts++;

                } else {

                    product.style.display = "none";

                }

            });


            /* ---------- NO RESULTS ---------- */

            let noResults =
                document.getElementById("noResults");


            if (!noResults) {

                noResults =
                    document.createElement("div");

                noResults.id = "noResults";

                noResults.style.cssText = `
                    text-align:center;
                    padding:40px;
                    color:#666;
                    font-size:18px;
                `;


                const cards =
                    document.querySelector(".cards");


                if (cards) {

                    cards.parentNode.insertBefore(
                        noResults,
                        cards.nextSibling
                    );

                }

            }


            if (
                searchTerm !== "" &&
                visibleProducts === 0
            ) {

                noResults.innerHTML = `
                    🔍 No products found.
                    <br>
                    <small>
                        Try searching for dragon,
                        dinosaur, axolotl or another print.
                    </small>
                `;

                noResults.style.display = "block";

            } else {

                noResults.style.display = "none";

            }

        }
    );

}


/* =========================================================
   CHECKOUT
   ========================================================= */

function checkout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty! Add a product before checking out."
        );

        return;

    }


    let total = 0;

    cart.forEach(item => {

        total +=
            Number(item.price) *
            Number(item.quantity);

    });


    alert(
        "🛍️ Perfect Prints Checkout\n\n" +
        "Your order total is $" +
        total.toFixed(2) +
        " AUD.\n\n" +
        "Checkout/payment setup can be connected next!"
    );

}


/* =========================================================
   CART MESSAGE
   ========================================================= */

function showCartMessage(productName) {

    const message =
        document.createElement("div");


    message.textContent =
        "✅ " + productName + " added to cart!";


    message.style.cssText = `
        position:fixed;
        bottom:25px;
        right:25px;
        z-index:9999;

        padding:14px 20px;

        background:#171717;
        color:white;

        border-radius:12px;

        box-shadow:0 10px 30px rgba(0,0,0,0.25);

        font-weight:600;

        animation:perfectPrintsMessage 0.3s ease;
    `;


    document.body.appendChild(message);


    setTimeout(() => {

        message.style.opacity = "0";
        message.style.transform = "translateY(10px)";

    }, 1800);


    setTimeout(() => {

        message.remove();

    }, 2200);

}


/* =========================================================
   KEYBOARD SUPPORT
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeCart();

        }

    }
);


/* =========================================================
   CLICK OUTSIDE CART
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const cartPanel =
            document.getElementById("cartPanel");

        const cartButton =
            document.querySelector(".cart-btn");


        if (!cartPanel || !cartButton) {
            return;
        }


        if (
            cartPanel.classList.contains("open") &&
            !cartPanel.contains(event.target) &&
            !cartButton.contains(event.target)
        ) {

            closeCart();

        }

    }
);


/* =========================================================
   PERFECT PRINTS READY
   ========================================================= */

console.log(
    "🐉 Perfect Prints website JavaScript loaded successfully!"
);
