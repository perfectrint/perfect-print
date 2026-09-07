/* =========================================================
   PERFECT PRINTS
   Main Website JavaScript
   ========================================================= */

const PRODUCTS = [
    {
        id: "crystal-dragon",
        name: "Crystal Dragon",
        price: 25,
        image: "dragon.jpg",
        category: "Articulated",
        description: "A premium articulated dragon with flexible movement."
    },
    {
        id: "dinosaur",
        name: "Dinosaur",
        price: 15,
        image: "dinosaur.jpg",
        category: "Articulated",
        description: "A fun articulated dinosaur with smooth movement."
    },
    {
        id: "axolotl",
        name: "Axolotl",
        price: 15,
        image: "axolotl.jpg",
        category: "Articulated",
        description: "A colourful articulated axolotl design."
    },
    {
        id: "snake",
        name: "Snake",
        price: 15,
        image: "snake.jpg",
        category: "Articulated",
        description: "A flexible articulated snake."
    },
    {
        id: "turtle",
        name: "Turtle",
        price: 10,
        image: "turtle.jpg",
        category: "Articulated",
        description: "A fun articulated turtle."
    },
    {
        id: "octopus",
        name: "Octopus",
        price: 10,
        image: "octopus.jpg",
        category: "Desk Toy",
        description: "A flexible octopus desk toy."
    },
    {
        id: "custom-print",
        name: "Custom Prints",
        price: 0,
        image: "custom.jpg",
        category: "Custom",
        description: "Have an idea or model? Ask Perfect Prints about a custom print."
    }
];

const CART_KEY = "perfectPrintsCart";
const WISHLIST_KEY = "perfectPrintsWishlist";
const ACCOUNT_KEY = "perfectPrintsAccount";
const ORDERS_KEY = "perfectPrintsOrders";


/* =========================================================
   STORAGE HELPERS
   ========================================================= */

function readStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);

        if (!value) {
            return fallback;
        }

        const parsed = JSON.parse(value);

        return parsed ?? fallback;

    } catch (error) {
        return fallback;
    }
}


function writeStorage(key, value) {
    localStorage.setItem(
        key,
        JSON.stringify(value)
    );
}


/* =========================================================
   PRODUCTS
   ========================================================= */

function getProduct(id) {
    return PRODUCTS.find(
        product => product.id === id
    );
}


/* =========================================================
   CART
   ========================================================= */

let cart = readStorage(CART_KEY, []);

if (!Array.isArray(cart)) {
    cart = [];
}


function saveCart() {
    writeStorage(CART_KEY, cart);
    updateHeaderCounts();
}


function getCartCount() {
    return cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );
}


function getCartTotal() {
    return cart.reduce(
        (total, item) =>
            total +
            Number(item.price || 0) *
            Number(item.quantity || 0),
        0
    );
}


function addToCart(productId, quantity = 1) {

    const product = getProduct(productId);

    if (!product) {
        return;
    }

    if (product.price <= 0) {
        window.location.href = "contact.html";
        return;
    }

    const existing = cart.find(
        item => item.id === productId
    );

    if (existing) {

        existing.quantity += Number(quantity);

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: Number(quantity)
        });

    }

    saveCart();
    updateCart();

    showMessage(
        product.name + " added to your cart."
    );
}


function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart();
    updateCart();

    showMessage("Item removed from your cart.");
}


function changeQuantity(productId, change) {

    const item = cart.find(
        item => item.id === productId
    );

    if (!item) {
        return;
    }

    item.quantity += Number(change);

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart();
    updateCart();
}


function clearCart() {

    if (cart.length === 0) {
        return;
    }

    const confirmed = confirm(
        "Are you sure you want to empty your cart?"
    );

    if (!confirmed) {
        return;
    }

    cart = [];

    saveCart();
    updateCart();

    showMessage("Your cart has been emptied.");
}


/* =========================================================
   CART DISPLAY
   ========================================================= */

function updateCart() {

    updateHeaderCounts();

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");

    if (cartTotal) {
        cartTotal.textContent =
            getCartTotal().toFixed(2);
    }

    if (!cartItems) {
        return;
    }

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <svg viewBox="0 0 24 24" fill="none"
                        stroke="currentColor"
                        stroke-width="1.7"
                        width="42"
                        height="42">
                        <path d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.5L21 7H6"/>
                        <circle cx="10" cy="20" r="1"/>
                        <circle cx="18" cy="20" r="1"/>
                    </svg>
                </div>

                <h3>Your cart is empty</h3>

                <p>
                    Add some Perfect Prints creations to get started.
                </p>
            </div>
        `;

        return;
    }

    cartItems.innerHTML = cart.map(item => {

        const itemTotal =
            Number(item.price) *
            Number(item.quantity);

        return `
            <div class="cart-item">

                <div class="cart-item-image">
                    <img
                        src="${item.image || "logo.png"}"
                        alt="${escapeHTML(item.name)}"
                    >
                </div>

                <div class="cart-item-info">

                    <h3>
                        ${escapeHTML(item.name)}
                    </h3>

                    <p>
                        $${Number(item.price).toFixed(2)} each
                    </p>

                </div>

                <div class="cart-item-controls">

                    <button
                        type="button"
                        class="quantity-btn"
                        data-cart-action="decrease"
                        data-id="${item.id}"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>

                    <span class="quantity">
                        ${item.quantity}
                    </span>

                    <button
                        type="button"
                        class="quantity-btn"
                        data-cart-action="increase"
                        data-id="${item.id}"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>

                </div>

                <div class="cart-item-price">

                    <strong>
                        $${itemTotal.toFixed(2)}
                    </strong>

                    <button
                        type="button"
                        class="remove-btn"
                        data-cart-action="remove"
                        data-id="${item.id}"
                    >
                        Remove
                    </button>

                </div>

            </div>
        `;

    }).join("");
}


/* =========================================================
   CART PANEL
   ========================================================= */

function openCart() {

    const panel =
        document.getElementById("cartPanel");

    if (!panel) {
        return;
    }

    updateCart();

    panel.classList.add("open");
}


function closeCart() {

    const panel =
        document.getElementById("cartPanel");

    if (!panel) {
        return;
    }

    panel.classList.remove("open");
}


function checkout() {

    if (cart.length === 0) {

        showMessage(
            "Your cart is empty."
        );

        return;
    }

    window.location.href =
        "checkout.html";
}


/* =========================================================
   CART BUTTON EVENTS
   ========================================================= */

function setupCartEvents() {

    document.addEventListener(
        "click",
        function(event) {

            const actionButton =
                event.target.closest(
                    "[data-cart-action]"
                );

            if (actionButton) {

                const id =
                    actionButton.dataset.id;

                const action =
                    actionButton.dataset.cartAction;

                if (action === "increase") {
                    changeQuantity(id, 1);
                }

                if (action === "decrease") {
                    changeQuantity(id, -1);
                }

                if (action === "remove") {
                    removeFromCart(id);
                }

                return;
            }

            const cartButton =
                event.target.closest(".cart-btn");

            if (cartButton) {
                openCart();
            }

            const closeButton =
                event.target.closest(".cart-close");

            if (closeButton) {
                closeCart();
            }

            const checkoutButton =
                event.target.closest(
                    "[data-checkout]"
                );

            if (checkoutButton) {
                checkout();
            }

            const clearButton =
                event.target.closest(
                    "[data-clear-cart]"
                );

            if (clearButton) {
                clearCart();
            }
        }
    );

    document.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Escape") {
                closeCart();
            }

        }
    );
}


/* =========================================================
   HEADER COUNTS
   ========================================================= */

function updateHeaderCounts() {

    const cartCount =
        document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent =
            getCartCount();
    }


    const wishlist =
        readStorage(WISHLIST_KEY, []);

    const wishlistCount =
        document.getElementById(
            "wishlistCount"
        );

    if (wishlistCount) {

        wishlistCount.textContent =
            Array.isArray(wishlist)
                ? wishlist.length
                : 0;
    }
}


/* =========================================================
   WISHLIST
   ========================================================= */

function getWishlist() {

    const wishlist =
        readStorage(
            WISHLIST_KEY,
            []
        );

    return Array.isArray(wishlist)
        ? wishlist
        : [];
}


function saveWishlist(wishlist) {

    writeStorage(
        WISHLIST_KEY,
        wishlist
    );

    updateHeaderCounts();
}


function isInWishlist(productId) {

    return getWishlist()
        .includes(productId);
}


function toggleWishlist(productId) {

    const product =
        getProduct(productId);

    if (!product) {
        return;
    }

    let wishlist =
        getWishlist();

    if (wishlist.includes(productId)) {

        wishlist =
            wishlist.filter(
                id => id !== productId
            );

        showMessage(
            product.name +
            " removed from your wishlist."
        );

    } else {

        wishlist.push(productId);

        showMessage(
            product.name +
            " added to your wishlist."
        );
    }

    saveWishlist(wishlist);

    renderWishlist();
    renderProducts();
}


/* =========================================================
   WISHLIST DISPLAY
   ========================================================= */

function renderWishlist() {

    const container =
        document.getElementById(
            "wishlistItems"
        );

    if (!container) {
        return;
    }

    const wishlist =
        getWishlist();

    const products =
        wishlist
            .map(id => getProduct(id))
            .filter(Boolean);

    if (products.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-state-icon">
                    <svg viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.7"
                        width="44"
                        height="44">
                        <path d="M20.8 8.8c0 5.4-8.8 10.2-8.8 10.2S3.2 14.2 3.2 8.8A4.6 4.6 0 0 1 12 6.1a4.6 4.6 0 0 1 8.8 2.7Z"/>
                    </svg>
                </div>

                <h2>Your wishlist is empty</h2>

                <p>
                    Save products here so you can find them later.
                </p>

                <a href="products.html" class="btn btn-primary">
                    Browse Shop
                </a>

            </div>
        `;

        return;
    }

    container.innerHTML =
        products.map(createProductCard).join("");
}


/* =========================================================
   PRODUCT CARD
   ========================================================= */

function createProductCard(product) {

    const wished =
        isInWishlist(product.id);

    const price =
        product.price > 0
            ? `$${product.price.toFixed(2)}`
            : "Quote required";

    return `
        <article
            class="product-card"
            data-product-id="${product.id}"
        >

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                >

                <button
                    type="button"
                    class="wishlist-toggle ${wished ? "active" : ""}"
                    data-wishlist-id="${product.id}"
                    aria-label="${
                        wished
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }"
                >
                    <svg viewBox="0 0 24 24"
                        fill="${wished ? "currentColor" : "none"}"
                        stroke="currentColor"
                        stroke-width="1.7"
                        width="20"
                        height="20">
                        <path d="M20.8 8.8c0 5.4-8.8 10.2-8.8 10.2S3.2 14.2 3.2 8.8A4.6 4.6 0 0 1 12 6.1a4.6 4.6 0 0 1 8.8 2.7Z"/>
                    </svg>
                </button>

            </div>

            <div class="product-content">

                <span class="product-category">
                    ${escapeHTML(product.category)}
                </span>

                <h3>
                    ${escapeHTML(product.name)}
                </h3>

                <p>
                    ${escapeHTML(product.description)}
                </p>

                <div class="product-bottom">

                    <strong class="product-price">
                        ${price}
                    </strong>

                    ${
                        product.price > 0
                        ? `
                            <button
                                type="button"
                                class="product-add-btn"
                                data-add-product="${product.id}"
                            >
                                Add to Cart
                            </button>
                        `
                        : `
                            <a
                                href="contact.html"
                                class="product-add-btn"
                            >
                                Request Quote
                            </a>
                        `
                    }

                </div>

            </div>

        </article>
    `;
}


/* =========================================================
   PRODUCT LIST
   ========================================================= */

function renderProducts() {

    const container =
        document.getElementById(
            "productsGrid"
        );

    if (!container) {
        return;
    }

    container.innerHTML =
        PRODUCTS
            .map(createProductCard)
            .join("");
}


/* =========================================================
   PRODUCT BUTTON EVENTS
   ========================================================= */

function setupProductEvents() {

    document.addEventListener(
        "click",
        function(event) {

            const addButton =
                event.target.closest(
                    "[data-add-product]"
                );

            if (addButton) {

                addToCart(
                    addButton.dataset.addProduct
                );

                return;
            }


            const wishlistButton =
                event.target.closest(
                    "[data-wishlist-id]"
                );

            if (wishlistButton) {

                toggleWishlist(
                    wishlistButton.dataset.wishlistId
                );

                return;
            }

        }
    );
}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener(
        "input",
        function() {

            const searchTerm =
                searchInput.value
                    .toLowerCase()
                    .trim();

            const cards =
                document.querySelectorAll(
                    ".product-card"
                );

            cards.forEach(card => {

                const text =
                    card.textContent
                        .toLowerCase();

                card.style.display =
                    !searchTerm ||
                    text.includes(searchTerm)
                        ? ""
                        : "none";

            });

        }
    );
}


/* =========================================================
   CHECKOUT
   ========================================================= */

function loadCheckout() {

    const checkoutItems =
        document.getElementById(
            "checkoutItems"
        );

    const checkoutTotal =
        document.getElementById(
            "checkoutTotal"
        );

    if (!checkoutItems) {
        return;
    }

    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <div class="empty-state">

                <h2>Your cart is empty</h2>

                <p>
                    Add products before checking out.
                </p>

                <a
                    href="products.html"
                    class="btn btn-primary"
                >
                    Browse Shop
                </a>

            </div>
        `;

        if (checkoutTotal) {
            checkoutTotal.textContent =
                "0.00";
        }

        return;
    }

    checkoutItems.innerHTML =
        cart.map(item => {

            const total =
                item.price *
                item.quantity;

            return `
                <div class="checkout-item">

                    <div class="checkout-item-image">
                        <img
                            src="${item.image || "logo.png"}"
                            alt="${escapeHTML(item.name)}"
                        >
                    </div>

                    <div class="checkout-item-info">

                        <strong>
                            ${escapeHTML(item.name)}
                        </strong>

                        <p>
                            Quantity: ${item.quantity}
                        </p>

                    </div>

                    <strong>
                        $${total.toFixed(2)}
                    </strong>

                </div>
            `;

        }).join("");

    if (checkoutTotal) {

        checkoutTotal.textContent =
            getCartTotal().toFixed(2);

    }
}


function setupCheckoutForm() {

    const form =
        document.getElementById(
            "checkoutForm"
        );

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

            const nameField =
                document.getElementById(
                    "customerName"
                );

            const emailField =
                document.getElementById(
                    "customerEmail"
                );

            const phoneField =
                document.getElementById(
                    "customerPhone"
                );

            const addressField =
                document.getElementById(
                    "customerAddress"
                );


            const name =
                nameField
                    ? nameField.value.trim()
                    : "";

            const email =
                emailField
                    ? emailField.value.trim()
                    : "";

            const phone =
                phoneField
                    ? phoneField.value.trim()
                    : "";

            const address =
                addressField
                    ? addressField.value.trim()
                    : "";


            if (!name || !email) {

                alert(
                    "Please enter your name and email."
                );

                return;
            }


            const order = {

                orderNumber:
                    "PP-" +
                    Date.now(),

                customer:
                    name,

                email:
                    email,

                phone:
                    phone,

                address:
                    address,

                items:
                    cart.map(item => ({
                        ...item
                    })),

                total:
                    getCartTotal(),

                status:
                    "New",

                date:
                    new Date().toISOString()

            };


            const orders =
                readStorage(
                    ORDERS_KEY,
                    []
                );

            const safeOrders =
                Array.isArray(orders)
                    ? orders
                    : [];

            safeOrders.push(order);

            writeStorage(
                ORDERS_KEY,
                safeOrders
            );

            localStorage.setItem(
                "perfectPrintsLastOrder",
                JSON.stringify(order)
            );


            cart = [];

            saveCart();
            updateCart();


            const success =
                document.getElementById(
                    "orderSuccess"
                );

            if (success) {

                success.style.display =
                    "flex";

            } else {

                alert(
                    "Your order has been placed successfully. Your order number is " +
                    order.orderNumber +
                    "."
                );

            }

            form.reset();

            loadCheckout();

        }
    );
}


/* =========================================================
   ACCOUNT
   ========================================================= */

function loadAccount() {

    const account =
        readStorage(
            ACCOUNT_KEY,
            {}
        );

    const name =
        document.getElementById(
            "accountName"
        );

    const email =
        document.getElementById(
            "accountEmail"
        );

    const phone =
        document.getElementById(
            "accountPhone"
        );

    if (name) {
        name.value =
            account.name || "";
    }

    if (email) {
        email.value =
            account.email || "";
    }

    if (phone) {
        phone.value =
            account.phone || "";
    }

    updateAccountWelcome(
        account.name || ""
    );
}


function saveAccount(event) {

    event.preventDefault();

    const name =
        document.getElementById(
            "accountName"
        );

    const email =
        document.getElementById(
            "accountEmail"
        );

    const phone =
        document.getElementById(
            "accountPhone"
        );


    const account = {

        name:
            name
                ? name.value.trim()
                : "",

        email:
            email
                ? email.value.trim()
                : "",

        phone:
            phone
                ? phone.value.trim()
                : ""

    };


    writeStorage(
        ACCOUNT_KEY,
        account
    );

    updateAccountWelcome(
        account.name
    );

    showMessage(
        "Your account details have been saved."
    );
}


function updateAccountWelcome(name) {

    const welcome =
        document.getElementById(
            "accountWelcome"
        );

    if (!welcome) {
        return;
    }

    welcome.textContent =
        name
            ? "Welcome, " + name
            : "Welcome to Perfect Prints";
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
        ACCOUNT_KEY
    );

    const form =
        document.getElementById(
            "accountForm"
        );

    if (form) {
        form.reset();
    }

    updateAccountWelcome("");

    showMessage(
        "Your account details have been cleared."
    );
}


function setupAccount() {

    const form =
        document.getElementById(
            "accountForm"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        saveAccount
    );

    loadAccount();
}


/* =========================================================
   ADMIN SYSTEM
   ========================================================= */

let adminOrders = [];


function loadAdminOrders() {

    adminOrders =
        readStorage(
            ORDERS_KEY,
            []
        );

    if (!Array.isArray(adminOrders)) {
        adminOrders = [];
    }

    displayAdminOrders();
}


function saveAdminOrders() {

    writeStorage(
        ORDERS_KEY,
        adminOrders
    );
}


function displayAdminOrders() {

    const container =
        document.getElementById(
            "adminOrdersList"
        );

    if (!container) {
        return;
    }

    const searchInput =
        document.getElementById(
            "adminSearch"
        );

    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const filtered =
        adminOrders.filter(order => {

            const text =
                (
                    order.orderNumber ||
                    ""
                ) +
                " " +
                (
                    order.customer ||
                    ""
                ) +
                " " +
                (
                    order.email ||
                    ""
                );

            return text
                .toLowerCase()
                .includes(search);
        });


    if (filtered.length === 0) {

        container.innerHTML = `
            <div class="admin-empty">

                <h3>No orders found</h3>

                <p>
                    There are currently no matching orders.
                </p>

            </div>
        `;

        updateAdminStats();

        return;
    }


    container.innerHTML =
        filtered.map(order => {

            const status =
                order.status || "New";

            const date =
                order.date
                    ? new Date(
                        order.date
                    ).toLocaleString()
                    : "Unknown";


            return `
                <div class="admin-order">

                    <div class="admin-order-main">

                        <div>

                            <h3>
                                ${escapeHTML(
                                    order.orderNumber || "Order"
                                )}
                            </h3>

                            <p>
                                ${escapeHTML(
                                    order.customer || "Unknown customer"
                                )}
                            </p>

                            <p>
                                ${escapeHTML(
                                    order.email || ""
                                )}
                            </p>

                            <small>
                                ${date}
                            </small>

                        </div>


                        <div class="admin-order-right">

                            <strong>
                                $${Number(
                                    order.total || 0
                                ).toFixed(2)}
                            </strong>


                            <select
                                data-status-order="${escapeHTML(
                                    order.orderNumber
                                )}"
                            >

                                ${[
                                    "New",
                                    "Processing",
                                    "Shipped",
                                    "Completed"
                                ].map(option => `
                                    <option
                                        value="${option}"
                                        ${status === option ? "selected" : ""}
                                    >
                                        ${option}
                                    </option>
                                `).join("")}

                            </select>


                            <button
                                type="button"
                                data-view-order="${escapeHTML(
                                    order.orderNumber
                                )}"
                            >
                                View
                            </button>


                            <button
                                type="button"
                                class="admin-delete-btn"
                                data-delete-order="${escapeHTML(
                                    order.orderNumber
                                )}"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>
            `;

        }).join("");


    updateAdminStats();
}


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

        const total =
            adminOrders.reduce(
                (sum, order) =>
                    sum +
                    Number(order.total || 0),
                0
            );

        sales.textContent =
            total.toFixed(2);
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


function changeOrderStatus(
    orderNumber,
    newStatus
) {

    const order =
        adminOrders.find(
            item =>
                item.orderNumber ===
                orderNumber
        );

    if (!order) {
        return;
    }

    order.status =
        newStatus;

    saveAdminOrders();
    displayAdminOrders();

    showMessage(
        "Order status updated."
    );
}


function viewOrder(orderNumber) {

    const order =
        adminOrders.find(
            item =>
                item.orderNumber ===
                orderNumber
        );

    if (!order) {
        return;
    }

    const details =
        document.getElementById(
            "orderDetails"
        );

    const modal =
        document.getElementById(
            "orderModal"
        );

    if (!details || !modal) {
        return;
    }


    const items =
        (order.items || [])
            .map(item => {

                const total =
                    Number(item.price || 0) *
                    Number(item.quantity || 0);

                return `
                    <div class="admin-detail-item">

                        <span>
                            ${escapeHTML(
                                item.name
                            )}
                            × ${item.quantity}
                        </span>

                        <strong>
                            $${total.toFixed(2)}
                        </strong>

                    </div>
                `;

            }).join("");


    details.innerHTML = `

        <h2>
            Order ${escapeHTML(
                order.orderNumber || ""
            )}
        </h2>

        <hr>

        <h3>
            Customer
        </h3>

        <p>
            ${escapeHTML(
                order.customer || ""
            )}
        </p>

        <p>
            ${escapeHTML(
                order.email || ""
            )}
        </p>

        ${
            order.phone
                ? `<p>${escapeHTML(order.phone)}</p>`
                : ""
        }

        ${
            order.address
                ? `<p>${escapeHTML(order.address)}</p>`
                : ""
        }

        <h3>
            Items
        </h3>

        ${items}

        <div class="admin-detail-total">

            <strong>
                Total
            </strong>

            <strong>
                $${Number(
                    order.total || 0
                ).toFixed(2)}
            </strong>

        </div>

        <h3>
            Status
        </h3>

        <p>
            ${escapeHTML(
                order.status || "New"
            )}
        </p>

        <button
            type="button"
            class="modal-action-btn"
            onclick="closeOrderModal()"
        >
            Close
        </button>
    `;


    modal.style.display =
        "flex";
}


function closeOrderModal() {

    const modal =
        document.getElementById(
            "orderModal"
        );

    if (modal) {
        modal.style.display =
            "none";
    }
}


function deleteOrder(orderNumber) {

    const confirmed =
        confirm(
            "Delete this order permanently?"
        );

    if (!confirmed) {
        return;
    }

    adminOrders =
        adminOrders.filter(
            order =>
                order.orderNumber !==
                orderNumber
        );

    saveAdminOrders();
    displayAdminOrders();

    showMessage(
        "Order deleted."
    );
}


function clearAllOrders() {

    if (adminOrders.length === 0) {

        showMessage(
            "There are no orders to clear."
        );

        return;
    }

    const confirmed =
        confirm(
            "This will delete all orders. Continue?"
        );

    if (!confirmed) {
        return;
    }

    adminOrders = [];

    saveAdminOrders();
    displayAdminOrders();

    showMessage(
        "All orders have been cleared."
    );
}


function setupAdmin() {

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


    document.addEventListener(
        "change",
        function(event) {

            const select =
                event.target.closest(
                    "[data-status-order]"
                );

            if (!select) {
                return;
            }

            changeOrderStatus(
                select.dataset.statusOrder,
                select.value
            );
        }
    );


    document.addEventListener(
        "click",
        function(event) {

            const viewButton =
                event.target.closest(
                    "[data-view-order]"
                );

            if (viewButton) {

                viewOrder(
                    viewButton.dataset.viewOrder
                );

                return;
            }


            const deleteButton =
                event.target.closest(
                    "[data-delete-order]"
                );

            if (deleteButton) {

                deleteOrder(
                    deleteButton.dataset.deleteOrder
                );

                return;
            }

        }
    );


    loadAdminOrders();
}


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

function setupMobileMenu() {

    const toggle =
        document.querySelector(
            ".mobile-menu-toggle"
        );

    const menu =
        document.querySelector(
            ".mobile-nav"
        );

    if (!toggle || !menu) {
        return;
    }

    toggle.addEventListener(
        "click",
        function() {

            menu.classList.toggle(
                "open"
            );

        }
    );
}


/* =========================================================
   TOAST MESSAGE
   ========================================================= */

function showMessage(text) {

    const old =
        document.querySelector(
            ".perfect-message"
        );

    if (old) {
        old.remove();
    }


    const message =
        document.createElement(
            "div"
        );

    message.className =
        "perfect-message";

    message.textContent =
        text;


    message.style.cssText = `
        position: fixed;
        bottom: 25px;
        right: 25px;
        z-index: 9999;
        padding: 14px 20px;
        background: #10162a;
        color: #f5f7ff;
        border: 1px solid rgba(94,126,255,0.35);
        border-radius: 12px;
        box-shadow: 0 15px 40px rgba(0,0,0,0.35);
        font-weight: 600;
        opacity: 1;
        transform: translateY(0);
        transition:
            opacity 0.35s ease,
            transform 0.35s ease;
    `;


    document.body.appendChild(
        message
    );


    setTimeout(
        function() {

            message.style.opacity =
                "0";

            message.style.transform =
                "translateY(10px)";

        },
        1800
    );


    setTimeout(
        function() {

            if (message.parentNode) {
                message.remove();
            }

        },
        2200
    );
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   CLOSE CART WHEN CLICKING OUTSIDE
   ========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const panel =
            document.getElementById(
                "cartPanel"
            );

        const button =
            event.target.closest(
                ".cart-btn"
            );

        if (
            !panel ||
            !panel.classList.contains("open")
        ) {
            return;
        }

        if (
            !panel.contains(event.target) &&
            !button
        ) {
            closeCart();
        }

    }
);


/* =========================================================
   START WEBSITE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCart();

        updateHeaderCounts();

        setupCartEvents();

        setupProductEvents();

        setupSearch();

        setupMobileMenu();

        renderProducts();

        renderWishlist();

        loadCheckout();

        setupCheckoutForm();

        setupAccount();

        setupAdmin();

    }
);
