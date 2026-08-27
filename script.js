/* =========================================================
   PERFECT PRINTS
   Shopping Cart + Search
   ========================================================= */

let cart = [];


/* =========================================================
   LOAD CART
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const savedCart = localStorage.getItem("perfectPrintsCart");

    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);

            if (!Array.isArray(cart)) {
                cart = [];
            }

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

   /* Save order for the admin dashboard */

const savedOrders =
    localStorage.getItem(
        "perfectPrintsOrders"
    );

let orders = [];

if (savedOrders) {

    try {

        orders = JSON.parse(savedOrders);

    } catch (error) {

        orders = [];

    }

}

order.status = "New";

orders.push(order);

localStorage.setItem(
    "perfectPrintsOrders",
    JSON.stringify(orders)
);

}


/* =========================================================
   ADD TO CART
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
    showMessage(productName + " added to cart!");

}


/* =========================================================
   REMOVE ITEM
   ========================================================= */

function removeFromCart(productName) {

    cart = cart.filter(
        item => item.name !== productName
    );

    saveCart();
    updateCart();

}


/* =========================================================
   CHANGE QUANTITY
   ========================================================= */

function changeQuantity(productName, change) {

    const product = cart.find(
        item => item.name === productName
    );

    if (!product) return;

    product.quantity += change;

    if (product.quantity <= 0) {
        removeFromCart(productName);
        return;
    }

    saveCart();
    updateCart();

}


/* =========================================================
   CLEAR CART
   ========================================================= */

function clearCart() {

    if (cart.length === 0) return;

    const confirmed = confirm(
        "Are you sure you want to empty your cart?"
    );

    if (!confirmed) return;

    cart = [];

    saveCart();
    updateCart();

}


/* =========================================================
   UPDATE CART
   ========================================================= */

function updateCart() {

    const cartCount = document.getElementById("cartCount");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    /*
       Calculate total number of products
    */

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );


    /*
       Calculate total price
    */

    const totalPrice = cart.reduce(
        (total, item) =>
            total + (item.price * item.quantity),
        0
    );


    /*
       Update cart number
    */

    if (cartCount) {
        cartCount.textContent = totalItems;
    }


    /*
       Update total
    */

    if (cartTotal) {
        cartTotal.textContent =
            totalPrice.toFixed(2);
    }


    /*
       Update cart products
    */

    if (!cartItems) return;


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <div style="font-size:45px;">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some awesome 3D prints!</p>
            </div>
        `;

        return;
    }


    /*
       Create cart HTML
    */

    cartItems.innerHTML = cart.map(item => {

        const itemTotal =
            item.price * item.quantity;

        return `
            <div class="cart-item">

                <div class="cart-item-info">

                    <h3>${item.name}</h3>

                    <p>
                        $${item.price.toFixed(2)} each
                    </p>

                </div>


                <div class="cart-item-controls">

                    <button
                        onclick="changeQuantity('${item.name}', -1)"
                        class="quantity-btn">
                        −
                    </button>

                    <span class="quantity">
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity('${item.name}', 1)"
                        class="quantity-btn">
                        +
                    </button>

                </div>


                <div class="cart-item-price">

                    <strong>
                        $${itemTotal.toFixed(2)}
                    </strong>

                    <button
                        onclick="removeFromCart('${item.name}')"
                        class="remove-btn">
                        Remove
                    </button>

                </div>

            </div>
        `;

    }).join("");

}


/* =========================================================
   OPEN CART
   ========================================================= */

function openCart() {

    const cartPanel =
        document.getElementById("cartPanel");

    if (!cartPanel) return;

    updateCart();

    cartPanel.classList.add("open");

}


/* =========================================================
   CLOSE CART
   ========================================================= */

function closeCart() {

    const cartPanel =
        document.getElementById("cartPanel");

    if (!cartPanel) return;

    cartPanel.classList.remove("open");

}


/* =========================================================
   CHECKOUT
   ========================================================= */

function checkout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty. Add a product first!"
        );

        return;
    }

    window.location.href = "checkout.html";

}


    const total = cart.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );


    const orderList = cart.map(item =>
        `${item.name} x${item.quantity}`
    ).join("\n");


    const message =
        "Perfect Prints Order\n\n" +
        orderList +
        "\n\n" +
        "Total: $" +
        total.toFixed(2) +
        " AUD";


    /*
       For now this sends the customer
       to the contact page with the order
       information ready to copy.
    */

    alert(
        message +
        "\n\nCheckout is ready! " +
        "Contact Perfect Prints to complete your order."
    );

}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {

    const searchInput =
        document.getElementById("searchInput");

    if (!searchInput) return;


    searchInput.addEventListener(
        "input",
        function () {

            const searchTerm =
                searchInput.value
                    .toLowerCase()
                    .trim();

            const products =
                document.querySelectorAll(
                    ".product-card"
                );


            products.forEach(product => {

                const text =
                    product.textContent
                        .toLowerCase();

                if (
                    searchTerm === "" ||
                    text.includes(searchTerm)
                ) {

                    product.style.display = "";

                } else {

                    product.style.display = "none";

                }

            });

        }
    );

}


/* =========================================================
   MESSAGE
   ========================================================= */

function showMessage(text) {

    const oldMessage =
        document.querySelector(".perfect-message");

    if (oldMessage) {
        oldMessage.remove();
    }


    const message =
        document.createElement("div");

    message.className =
        "perfect-message";

    message.textContent = text;

    message.style.cssText = `
        position: fixed;
        bottom: 25px;
        right: 25px;
        z-index: 9999;

        padding: 14px 20px;

        background: #171717;
        color: white;

        border-radius: 12px;

        box-shadow:
            0 10px 30px
            rgba(0,0,0,0.25);

        font-weight: 600;

        transition:
            opacity 0.4s ease,
            transform 0.4s ease;
    `;


    document.body.appendChild(message);


    setTimeout(() => {

        message.style.opacity = "0";
        message.style.transform =
            "translateY(10px)";

    }, 1800);


    setTimeout(() => {

        message.remove();

    }, 2200);

}


/* =========================================================
   ESCAPE KEY
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


console.log(
    "🐉 Perfect Prints cart loaded!"
);

        }

    }
);


/* =========================================================
   PERFECT PRINTS READY
   ========================================================= */

console.log(
    "🐉 Perfect Prints website JavaScript loaded successfully!"
);
/* =========================================================
   CHECKOUT PAGE
   ========================================================= */

function loadCheckout() {

    const checkoutItems =
        document.getElementById("checkoutItems");

    const checkoutTotal =
        document.getElementById("checkoutTotal");

    if (!checkoutItems || !checkoutTotal) {
        return;
    }


    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty.</h3>

                <p>
                    Add some products before checking out.
                </p>

                <a href="products.html">
                    Browse Products
                </a>
            </div>
        `;

        checkoutTotal.textContent = "0.00";

        return;
    }


    let total = 0;


    checkoutItems.innerHTML = cart.map(item => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;

        return `
            <div class="checkout-item">

                <div>
                    <strong>
                        ${item.name}
                    </strong>

                    <p>
                        Quantity: ${item.quantity}
                    </p>
                </div>

                <strong>
                    $${itemTotal.toFixed(2)}
                </strong>

            </div>
        `;

    }).join("");


    checkoutTotal.textContent =
        total.toFixed(2);

}


/* =========================================================
   PLACE ORDER
   ========================================================= */

function setupCheckoutForm() {

    const form =
        document.getElementById("checkoutForm");

    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;
            }


            const name =
                document.getElementById(
                    "customerName"
                ).value.trim();


            const email =
                document.getElementById(
                    "customerEmail"
                ).value.trim();


            if (!name || !email) {

                alert(
                    "Please fill in your details."
                );

                return;
            }


            /*
               Save order information locally.
            */

            const order = {

                orderNumber:
                    "PP-" +
                    Date.now(),

                customer: name,

                email: email,

                items: cart,

                total: cart.reduce(
                    (sum, item) =>
                        sum +
                        item.price *
                        item.quantity,
                    0
                ),

                date:
                    new Date().toISOString()

            };


            localStorage.setItem(
                "perfectPrintsLastOrder",
                JSON.stringify(order)
            );


            /*
               Empty cart after order.
            */

            cart = [];

            saveCart();
            updateCart();


            /*
               Show confirmation.
            */

            const success =
                document.getElementById(
                    "orderSuccess"
                );

            if (success) {

                success.style.display =
                    "flex";

            }

        }
    );

}


/* =========================================================
   START CHECKOUT
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadCheckout();
        setupCheckoutForm();

    }
);
/* =========================================================
   PERFECT PRINTS ADMIN SYSTEM
   ========================================================= */

let adminOrders = [];


/* =========================================================
   LOAD ORDERS
   ========================================================= */

function loadAdminOrders() {

    const savedOrders =
        localStorage.getItem("perfectPrintsOrders");

    if (savedOrders) {

        try {

            adminOrders =
                JSON.parse(savedOrders);

            if (!Array.isArray(adminOrders)) {
                adminOrders = [];
            }

        } catch (error) {

            adminOrders = [];

        }

    } else {

        adminOrders = [];

    }

    displayAdminOrders();

}


/* =========================================================
   SAVE ORDERS
   ========================================================= */

function saveAdminOrders() {

    localStorage.setItem(
        "perfectPrintsOrders",
        JSON.stringify(adminOrders)
    );

}


/* =========================================================
   DISPLAY ORDERS
   ========================================================= */

function displayAdminOrders() {

    const container =
        document.getElementById("adminOrdersList");

    if (!container) return;


    const searchInput =
        document.getElementById("adminSearch");


    const search =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


    const filteredOrders =
        adminOrders.filter(order => {

            const text =
                (
                    order.orderNumber +
                    " " +
                    order.customer +
                    " " +
                    order.email
                ).toLowerCase();

            return text.includes(search);

        });


    if (filteredOrders.length === 0) {

        container.innerHTML = `
            <div class="admin-empty">

                <div>📦</div>

                <h3>No orders found</h3>

                <p>
                    There are no orders matching your search.
                </p>

            </div>
        `;

        updateAdminStats();

        return;
    }


    container.innerHTML =
        filteredOrders.map(order => {

            const status =
                order.status || "New";


            const date =
                order.date
                    ? new Date(order.date)
                        .toLocaleString()
                    : "Unknown";


            return `
                <div class="admin-order">

                    <div class="admin-order-main">

                        <div>

                            <h3>
                                ${order.orderNumber}
                            </h3>

                            <p>
                                👤 ${order.customer}
                            </p>

                            <p>
                                📧 ${order.email}
                            </p>

                            <small>
                                ${date}
                            </small>

                        </div>


                        <div class="admin-order-right">

                            <strong>
                                $${Number(order.total || 0).toFixed(2)}
                            </strong>


                            <select
                                onchange="changeOrderStatus(
                                    '${order.orderNumber}',
                                    this.value
                                )"
                            >

                                <option
                                    ${status === "New" ? "selected" : ""}
                                >
                                    New
                                </option>

                                <option
                                    ${status === "Processing" ? "selected" : ""}
                                >
                                    Processing
                                </option>

                                <option
                                    ${status === "Shipped" ? "selected" : ""}
                                >
                                    Shipped
                                </option>

                                <option
                                    ${status === "Completed" ? "selected" : ""}
                                >
                                    Completed
                                </option>

                            </select>


                            <button
                                onclick="viewOrder(
                                    '${order.orderNumber}'
                                )"
                            >
                                👀 View
                            </button>


                            <button
                                class="admin-delete-btn"
                                onclick="deleteOrder(
                                    '${order.orderNumber}'
                                )"
                            >
                                🗑️
                            </button>

                        </div>

                    </div>

                </div>
            `;

        }).join("");


    updateAdminStats();

}


/* =========================================================
   ADMIN STATISTICS
   ========================================================= */

function updateAdminStats() {

    const orderCount =
        document.getElementById(
            "adminOrderCount"
        );

    const sales =
        document.getElementById(
            "adminSales"
        );

    const newOrders =
        document.getElementById(
            "adminNewOrders"
        );


    if (orderCount) {

        orderCount.textContent =
            adminOrders.length;

    }


    if (sales) {

        const totalSales =
            adminOrders.reduce(
                (sum, order) =>
                    sum +
                    Number(order.total || 0),
                0
            );

        sales.textContent =
            totalSales.toFixed(2);

    }


    if (newOrders) {

        const count =
            adminOrders.filter(
                order =>
                    !order.status ||
                    order.status === "New"
            ).length;

        newOrders.textContent =
            count;

    }

}


/* =========================================================
   CHANGE ORDER STATUS
   ========================================================= */

function changeOrderStatus(
    orderNumber,
    newStatus
) {

    const order =
        adminOrders.find(
            order =>
                order.orderNumber === orderNumber
        );


    if (!order) return;


    order.status = newStatus;

    saveAdminOrders();

    displayAdminOrders();

}


/* =========================================================
   VIEW ORDER
   ========================================================= */

function viewOrder(orderNumber) {

    const order =
        adminOrders.find(
            order =>
                order.orderNumber === orderNumber
        );


    if (!order) return;


    const details =
        document.getElementById(
            "orderDetails"
        );


    if (!details) return;


    const items =
        (order.items || []).map(item => {

            return `
                <div class="admin-detail-item">

                    <span>
                        ${item.name}
                        × ${item.quantity}
                    </span>

                    <strong>
                        $${(
                            item.price *
                            item.quantity
                        ).toFixed(2)}
                    </strong>

                </div>
            `;

        }).join("");


    details.innerHTML = `

        <h2>
            📦 Order ${order.orderNumber}
        </h2>

        <hr>

        <h3>Customer</h3>

        <p>
            👤 ${order.customer}
        </p>

        <p>
            📧 ${order.email}
        </p>


        <h3>Items</h3>

        ${items}


        <div class="admin-detail-total">

            <strong>Total</strong>

            <strong>
                $${Number(order.total || 0).toFixed(2)}
            </strong>

        </div>


        <h3>Status</h3>

        <p>
            ${order.status || "New"}
        </p>


        <button
            class="modal-action-btn"
            onclick="closeOrderModal()"
        >
            Close
        </button>

    `;


    const modal =
        document.getElementById(
            "orderModal"
        );


    if (modal) {

        modal.style.display = "flex";

    }

}


/* =========================================================
   CLOSE ORDER MODAL
   ========================================================= */

function closeOrderModal() {

    const modal =
        document.getElementById(
            "orderModal"
        );


    if (modal) {

        modal.style.display = "none";

    }

}


/* =========================================================
   DELETE ORDER
   ========================================================= */

function deleteOrder(orderNumber) {

    const confirmed =
        confirm(
            "Delete this order permanently?"
        );


    if (!confirmed) return;


    adminOrders =
        adminOrders.filter(
            order =>
                order.orderNumber !== orderNumber
        );


    saveAdminOrders();

    displayAdminOrders();

}


/* =========================================================
   CLEAR ALL ORDERS
   ========================================================= */

function clearAllOrders() {

    if (adminOrders.length === 0) {

        alert("There are no orders to clear.");

        return;

    }


    const confirmed =
        confirm(
            "WARNING: This will delete ALL orders. Continue?"
        );


    if (!confirmed) return;


    adminOrders = [];

    saveAdminOrders();

    displayAdminOrders();

}


/* =========================================================
   ADMIN SEARCH
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const search =
            document.getElementById(
                "adminSearch"
            );


        if (search) {

            search.addEventListener(
                "input",
                displayAdminOrders
            );

        }


        loadAdminOrders();

    }
);
/* =========================================================
   PERFECT PRINTS ACCOUNT SYSTEM
   ========================================================= */

function loadAccount() {

    const savedAccount =
        localStorage.getItem("perfectPrintsAccount");

    if (!savedAccount) {
        return;
    }

    try {

        const account =
            JSON.parse(savedAccount);

        const name =
            document.getElementById("accountName");

        const email =
            document.getElementById("accountEmail");

        const phone =
            document.getElementById("accountPhone");

        if (name) {
            name.value = account.name || "";
        }

        if (email) {
            email.value = account.email || "";
        }

        if (phone) {
            phone.value = account.phone || "";
        }

        updateAccountWelcome(account.name);

    } catch (error) {

        console.log("Could not load account.");

    }

}


function saveAccount(event) {

    event.preventDefault();

    const name =
        document.getElementById("accountName").value.trim();

    const email =
        document.getElementById("accountEmail").value.trim();

    const phone =
        document.getElementById("accountPhone").value.trim();

    const account = {

        name: name,
        email: email,
        phone: phone

    };

    localStorage.setItem(
        "perfectPrintsAccount",
        JSON.stringify(account)
    );

    updateAccountWelcome(name);

    alert("✅ Your account details have been saved!");

}


function updateAccountWelcome(name) {

    const welcome =
        document.getElementById("accountWelcome");

    if (!welcome) {
        return;
    }

    if (name) {

        welcome.textContent =
            "Welcome, " + name + "! 👋";

    } else {

        welcome.textContent =
            "Welcome to Perfect Prints!";

    }

}


function clearAccount() {

    const confirmed =
        confirm(
            "Are you sure you want to clear your account details?"
        );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem(
        "perfectPrintsAccount"
    );

    const form =
        document.getElementById("accountForm");

    if (form) {
        form.reset();
    }

    updateAccountWelcome("");

    alert("Account details cleared.");

}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        const accountForm =
            document.getElementById("accountForm");

        if (accountForm) {

            accountForm.addEventListener(
                "submit",
                saveAccount
            );

            loadAccount();

        }

    }
);
    <footer>

        <h2>🐉 Perfect Prints</h2>

        <p>
            Creating amazing articulated 3D prints with quality,
            creativity and care.
        </p>

        <p>
            © 2026 Perfect Prints. All Rights Reserved.
        </p>

    </footer>

    <script src="script.js"></script>

</body>
