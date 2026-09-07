/* =========================================================
   PERFECT PRINTS
   Main JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================================
       STORAGE
       ========================================================= */

    const CART_KEY = "perfectPrintsCart";
    const WISHLIST_KEY = "perfectPrintsWishlist";
    const ACCOUNT_KEY = "perfectPrintsAccount";
    const ORDERS_KEY = "perfectPrintsOrders";

    function readStorage(key, fallback = []) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            console.warn(`Could not read ${key}`, error);
            return fallback;
        }
    }

    function writeStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn(`Could not save ${key}`, error);
        }
    }


    /* =========================================================
       PRODUCTS
       ========================================================= */

    const PRODUCTS = {
        "Flexi Dragon": {
            id: "flexi-dragon",
            name: "Flexi Dragon",
            price: 15,
            category: "animals",
            type: "Flexible Dragon",
            rating: 5.0,
            image: "dragon.jpg"
        },

        "Mini Dinosaur": {
            id: "mini-dinosaur",
            name: "Mini Dinosaur",
            price: 10,
            category: "animals",
            type: "Figure Dinosaur",
            rating: 5.0,
            image: "dinosaur.jpg"
        },

        "Cute Axolotl": {
            id: "cute-axolotl",
            name: "Cute Axolotl",
            price: 12,
            category: "animals",
            type: "Figure Animal",
            rating: 4.9,
            image: "axolotl.jpg"
        },

        "Flexi Snake": {
            id: "flexi-snake",
            name: "Flexi Snake",
            price: 13,
            category: "animals",
            type: "Flexible Snake",
            rating: 5.0,
            image: "snake.jpg"
        },

        "Turtle": {
            id: "turtle",
            name: "Turtle",
            price: 10,
            category: "animals",
            type: "Figure Animal",
            rating: 5.0,
            image: "turtle.jpg"
        },

        "Octopus": {
            id: "octopus",
            name: "Octopus",
            price: 10,
            category: "animals",
            type: "Figure Animal",
            rating: 5.0,
            image: "octopus.jpg"
        }
    };


    /* =========================================================
       HELPERS
       ========================================================= */

    function getProduct(nameOrId) {
        if (!nameOrId) return null;

        if (PRODUCTS[nameOrId]) {
            return PRODUCTS[nameOrId];
        }

        return Object.values(PRODUCTS).find(product =>
            product.id === nameOrId
        ) || null;
    }


    function formatPrice(price) {
        return `$${Number(price).toFixed(2)}`;
    }


    /* =========================================================
       CART
       ========================================================= */

    function getCart() {
        return readStorage(CART_KEY, []);
    }


    function saveCart(cart) {
        writeStorage(CART_KEY, cart);
        updateCartCount();
    }


    function addToCart(productName, price = null, quantity = 1) {
        const product = getProduct(productName);

        const name = product ? product.name : productName;
        const productPrice = product
            ? product.price
            : Number(price) || 0;

        let cart = getCart();

        const existing = cart.find(item =>
            item.name === name ||
            item.id === product?.id
        );

        if (existing) {
            existing.quantity = Number(existing.quantity || 1) + quantity;
        } else {
            cart.push({
                id: product?.id || String(name).toLowerCase().replace(/\s+/g, "-"),
                name,
                price: productPrice,
                quantity
            });
        }

        saveCart(cart);

        showToast(
            "Added to cart",
            `${name} has been added to your cart.`
        );
    }


    function removeFromCart(productId) {
        const cart = getCart();

        const updated = cart.filter(item =>
            item.id !== productId &&
            item.name !== productId
        );

        saveCart(updated);
    }


    function changeCartQuantity(productId, amount) {
        const cart = getCart();

        const item = cart.find(item =>
            item.id === productId ||
            item.name === productId
        );

        if (!item) return;

        item.quantity = Number(item.quantity || 1) + amount;

        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        saveCart(cart);
    }


    function updateCartCount() {
        const cart = getCart();

        const count = cart.reduce(
            (total, item) => total + Number(item.quantity || 1),
            0
        );

        document.querySelectorAll(
            "#cartCount, .cart-count"
        ).forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? "" : "";
        });
    }


    /* =========================================================
       CART BUTTONS
       ========================================================= */

    document.querySelectorAll(".add-button").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();

            const productName =
                button.dataset.product ||
                button.closest(".product-card")?.dataset.name;

            const price =
                button.dataset.price ||
                button.closest(".product-card")?.dataset.price ||
                0;

            if (!productName) return;

            addToCart(productName, price);
        });
    });


    /* =========================================================
       WISHLIST
       ========================================================= */

    function getWishlist() {
        return readStorage(WISHLIST_KEY, []);
    }


    function saveWishlist(wishlist) {
        writeStorage(WISHLIST_KEY, wishlist);
        updateWishlistCount();
    }


    function updateWishlistCount() {
        const wishlist = getWishlist();

        document.querySelectorAll(
            "#wishlistCount, .wishlist-count"
        ).forEach(element => {
            element.textContent = wishlist.length;
        });
    }


    function toggleWishlist(productName, button) {
        const product = getProduct(productName);

        const name = product
            ? product.name
            : productName;

        let wishlist = getWishlist();

        const index = wishlist.indexOf(name);

        if (index >= 0) {
            wishlist.splice(index, 1);

            if (button) {
                button.classList.remove("liked");
                button.setAttribute("aria-pressed", "false");
            }

            showToast(
                "Removed from wishlist",
                `${name} was removed from your wishlist.`
            );
        } else {
            wishlist.push(name);

            if (button) {
                button.classList.add("liked");
                button.setAttribute("aria-pressed", "true");
            }

            showToast(
                "Saved to wishlist",
                `${name} was added to your wishlist.`
            );
        }

        saveWishlist(wishlist);
    }


    document.querySelectorAll(".wishlist-button").forEach(button => {
        const productName =
            button.dataset.product ||
            button.closest(".product-card")?.dataset.name;

        if (!productName) return;

        const wishlist = getWishlist();

        if (wishlist.includes(productName)) {
            button.classList.add("liked");
            button.setAttribute("aria-pressed", "true");
        }

        button.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            toggleWishlist(productName, button);
        });
    });


    /* =========================================================
       SEARCH
       ========================================================= */

    const searchInput = document.querySelector("#searchInput");

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value
                .trim()
                .toLowerCase();

            document.querySelectorAll(".product-card").forEach(card => {
                const name =
                    card.dataset.name?.toLowerCase() || "";

                const category =
                    card.dataset.category?.toLowerCase() || "";

                const text =
                    card.textContent.toLowerCase();

                const matches =
                    !query ||
                    name.includes(query) ||
                    category.includes(query) ||
                    text.includes(query);

                card.style.display = matches ? "" : "none";
            });
        });
    }


    /* =========================================================
       SEARCH SHORTCUT
       ========================================================= */

    document.addEventListener("keydown", event => {
        const isShortcut =
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k";

        if (!isShortcut) return;

        event.preventDefault();

        searchInput?.focus();
    });


    /* =========================================================
       MOBILE MENU
       ========================================================= */

    const mobileMenuButton =
        document.querySelector("#mobileMenuButton");

    const mobileMenu =
        document.querySelector("#mobileMenu");

    if (mobileMenuButton && mobileMenu) {

        mobileMenuButton.addEventListener("click", () => {

            const isOpen =
                mobileMenu.classList.toggle("open");

            mobileMenuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            const icon =
                mobileMenuButton.querySelector("i");

            if (icon) {
                icon.className = isOpen
                    ? "fa-solid fa-xmark"
                    : "fa-solid fa-bars";
            }
        });


        mobileMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("open");

                mobileMenuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                const icon =
                    mobileMenuButton.querySelector("i");

                if (icon) {
                    icon.className = "fa-solid fa-bars";
                }
            });
        });
    }


    /* =========================================================
       COLOUR SELECTOR
       ========================================================= */

    const colourButtons =
        document.querySelectorAll(".colour");

    const selectedColour =
        document.querySelector("#selectedColour");

    const previewObject =
        document.querySelector("#previewObject");

    colourButtons.forEach(button => {

        button.addEventListener("click", () => {

            colourButtons.forEach(item =>
                item.classList.remove("selected")
            );

            button.classList.add("selected");

            const colour =
                button.dataset.colour ||
                button.style.getPropertyValue("--colour");

            if (selectedColour) {
                selectedColour.textContent =
                    button.dataset.name ||
                    button.getAttribute("aria-label") ||
                    "Selected";
            }

            if (previewObject && colour) {
                previewObject.style.setProperty(
                    "--selected",
                    colour
                );
            }
        });

    });


    /* =========================================================
       SCROLL REVEAL
       ========================================================= */

    const revealElements =
        document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "visible"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );
                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    /* =========================================================
       STAT COUNTERS
       ========================================================= */

    const statNumbers =
        document.querySelectorAll("[data-number]");

    function animateNumber(element) {

        const target =
            Number(element.dataset.number);

        if (!Number.isFinite(target)) return;

        const duration = 1200;
        const startTime = performance.now();

        function update(currentTime) {

            const progress =
                Math.min(
                    (currentTime - startTime) / duration,
                    1
                );

            const eased =
                1 - Math.pow(1 - progress, 3);

            const value =
                Math.floor(target * eased);

            element.textContent =
                value.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent =
                    target.toLocaleString();
            }
        }

        requestAnimationFrame(update);
    }


    if ("IntersectionObserver" in window) {

        const statsObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target
                                .querySelectorAll("[data-number]")
                                .forEach(animateNumber);

                            statsObserver.unobserve(
                                entry.target
                            );
                        }

                    });

                },
                {
                    threshold: 0.3
                }
            );

        const statsSection =
            document.querySelector(".stats-section");

        if (statsSection) {
            statsObserver.observe(statsSection);
        }

    } else {

        statNumbers.forEach(element => {
            element.textContent =
                Number(element.dataset.number)
                    .toLocaleString();
        });

    }


    /* =========================================================
       TOAST
       ========================================================= */

    const toast =
        document.querySelector("#toast");

    const toastTitle =
        document.querySelector("#toastTitle");

    const toastMessage =
        document.querySelector("#toastMessage");

    let toastTimeout;


    function showToast(title, message) {

        if (!toast) return;

        if (toastTitle) {
            toastTitle.textContent = title;
        }

        if (toastMessage) {
            toastMessage.textContent = message;
        }

        toast.classList.add("show");

        clearTimeout(toastTimeout);

        toastTimeout = setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }


    /* =========================================================
       CLOSE TOAST
       ========================================================= */

    if (toast) {

        toast.addEventListener("click", () => {
            toast.classList.remove("show");
        });

    }


    /* =========================================================
       CART PAGE
       ========================================================= */

    const cartContainer =
        document.querySelector("#cartItems");

    if (cartContainer) {
        renderCartPage();
    }


    function renderCartPage() {

        const cart = getCart();

        if (!cartContainer) return;

        if (cart.length === 0) {

            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fa-solid fa-cart-shopping"></i>
                    </div>

                    <h3>Your cart is empty</h3>

                    <p>
                        Add some Perfect Prints to get started.
                    </p>

                    <a href="products.html" class="primary-button">
                        Browse Prints
                    </a>
                </div>
            `;

            updateCartTotals(0);
            return;
        }


        cartContainer.innerHTML = cart.map(item => {

            const product =
                getProduct(item.name) ||
                getProduct(item.id);

            const image =
                product?.image || "logo.png";

            const price =
                Number(item.price || product?.price || 0);

            const quantity =
                Number(item.quantity || 1);

            return `
                <div class="cart-item"
                     data-id="${escapeHTML(item.id || item.name)}">

                    <div class="cart-item-image">
                        <img
                            src="${escapeHTML(image)}"
                            alt="${escapeHTML(item.name)}"
                        >
                    </div>

                    <div class="cart-item-info">
                        <h3>${escapeHTML(item.name)}</h3>
                        <p>${formatPrice(price)}</p>
                    </div>

                    <div class="cart-item-quantity">

                        <button
                            type="button"
                            class="quantity-minus"
                            data-id="${escapeHTML(item.id || item.name)}">
                            −
                        </button>

                        <span>${quantity}</span>

                        <button
                            type="button"
                            class="quantity-plus"
                            data-id="${escapeHTML(item.id || item.name)}">
                            +
                        </button>

                    </div>

                    <div class="cart-item-total">
                        ${formatPrice(price * quantity)}
                    </div>

                    <button
                        type="button"
                        class="remove-cart-item"
                        data-id="${escapeHTML(item.id || item.name)}"
                        aria-label="Remove item">
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>
            `;

        }).join("");


        updateCartTotals(calculateCartTotal());


        cartContainer
            .querySelectorAll(".quantity-minus")
            .forEach(button => {

                button.addEventListener("click", () => {

                    changeCartQuantity(
                        button.dataset.id,
                        -1
                    );

                    renderCartPage();
                });

            });


        cartContainer
            .querySelectorAll(".quantity-plus")
            .forEach(button => {

                button.addEventListener("click", () => {

                    changeCartQuantity(
                        button.dataset.id,
                        1
                    );

                    renderCartPage();
                });

            });


        cartContainer
            .querySelectorAll(".remove-cart-item")
            .forEach(button => {

                button.addEventListener("click", () => {

                    removeFromCart(
                        button.dataset.id
                    );

                    renderCartPage();

                    showToast(
                        "Removed",
                        "The item was removed from your cart."
                    );
                });

            });
    }


    function calculateCartTotal() {

        return getCart().reduce(
            (total, item) => {

                const product =
                    getProduct(item.name) ||
                    getProduct(item.id);

                const price =
                    Number(
                        item.price ||
                        product?.price ||
                        0
                    );

                const quantity =
                    Number(item.quantity || 1);

                return total + price * quantity;

            },
            0
        );
    }


    function updateCartTotals(total) {

        document
            .querySelectorAll(
                "#cartSubtotal, .cart-subtotal"
            )
            .forEach(element => {
                element.textContent =
                    formatPrice(total);
            });

        document
            .querySelectorAll(
                "#cartTotal, .cart-total"
            )
            .forEach(element => {
                element.textContent =
                    formatPrice(total);
            });
    }


    /* =========================================================
       PRODUCT SEARCH / FILTERING ON SHOP PAGES
       ========================================================= */

    const productGrid =
        document.querySelector("#productsGrid");

    const filterButtons =
        document.querySelectorAll("[data-filter]");

    if (productGrid && filterButtons.length) {

        filterButtons.forEach(button => {

            button.addEventListener("click", () => {

                const filter =
                    button.dataset.filter;

                filterButtons.forEach(item =>
                    item.classList.remove("active")
                );

                button.classList.add("active");

                productGrid
                    .querySelectorAll(".product-card")
                    .forEach(card => {

                        const category =
                            card.dataset.category ||
                            "";

                        const matches =
                            filter === "all" ||
                            category === filter;

                        card.style.display =
                            matches ? "" : "none";
                    });

            });

        });
    }


    /* =========================================================
       PRODUCT CARD IMAGE FIX
       ========================================================= */

    document.querySelectorAll(".product-card").forEach(card => {

        const productName =
            card.dataset.name;

        const product =
            getProduct(productName);

        if (!product) return;

        const image =
            card.querySelector(".product-image img");

        if (image && product.image) {
            image.src = product.image;
            image.alt = product.name;
        }

    });


    /* =========================================================
       WISHLIST PAGE
       ========================================================= */

    const wishlistContainer =
        document.querySelector("#wishlistItems");

    if (wishlistContainer) {
        renderWishlistPage();
    }


    function renderWishlistPage() {

        const wishlist =
            getWishlist();

        if (!wishlistContainer) return;

        if (wishlist.length === 0) {

            wishlistContainer.innerHTML = `
                <div class="empty-wishlist">

                    <div class="empty-wishlist-icon">
                        <i class="fa-regular fa-heart"></i>
                    </div>

                    <h3>Your wishlist is empty</h3>

                    <p>
                        Save prints you want to come back to later.
                    </p>

                    <a href="products.html"
                       class="primary-button">
                        Explore Prints
                    </a>

                </div>
            `;

            return;
        }


        wishlistContainer.innerHTML =
            wishlist.map(name => {

                const product =
                    getProduct(name);

                if (!product) return "";

                return `
                    <article class="wishlist-item">

                        <div class="wishlist-image">
                            <img
                                src="${escapeHTML(product.image)}"
                                alt="${escapeHTML(product.name)}"
                            >
                        </div>

                        <div class="wishlist-info">

                            <h3>
                                ${escapeHTML(product.name)}
                            </h3>

                            <p>
                                ${formatPrice(product.price)}
                            </p>

                            <button
                                class="primary-button wishlist-add"
                                data-product="${escapeHTML(product.name)}">
                                Add to Cart
                            </button>

                            <button
                                class="remove-wishlist"
                                data-product="${escapeHTML(product.name)}">
                                Remove
                            </button>

                        </div>

                    </article>
                `;

            }).join("");


        wishlistContainer
            .querySelectorAll(".wishlist-add")
            .forEach(button => {

                button.addEventListener("click", () => {

                    addToCart(
                        button.dataset.product
                    );
                });

            });


        wishlistContainer
            .querySelectorAll(".remove-wishlist")
            .forEach(button => {

                button.addEventListener("click", () => {

                    let wishlist =
                        getWishlist();

                    wishlist =
                        wishlist.filter(
                            item =>
                                item !== button.dataset.product
                        );

                    saveWishlist(wishlist);

                    renderWishlistPage();
                });

            });
    }


    /* =========================================================
       ACCOUNT
       ========================================================= */

    const accountForm =
        document.querySelector("#accountForm");

    if (accountForm) {

        const account =
            readStorage(
                ACCOUNT_KEY,
                {}
            );

        const nameInput =
            accountForm.querySelector(
                '[name="name"]'
            );

        const emailInput =
            accountForm.querySelector(
                '[name="email"]'
            );

        if (nameInput && account.name) {
            nameInput.value = account.name;
        }

        if (emailInput && account.email) {
            emailInput.value = account.email;
        }


        accountForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const formData =
                    new FormData(accountForm);

                const data = {
                    name:
                        formData.get("name") || "",
                    email:
                        formData.get("email") || ""
                };

                writeStorage(
                    ACCOUNT_KEY,
                    data
                );

                showToast(
                    "Account saved",
                    "Your account details have been saved."
                );
            }
        );
    }


    /* =========================================================
       CHECKOUT
       ========================================================= */

    const checkoutForm =
        document.querySelector("#checkoutForm");

    if (checkoutForm) {

        const checkoutCart =
            getCart();

        if (checkoutCart.length === 0) {

            const message =
                document.querySelector(
                    "#checkoutEmpty"
                );

            if (message) {
                message.textContent =
                    "Your cart is empty.";
            }
        }


        checkoutForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const cart =
                    getCart();

                if (!cart.length) {

                    showToast(
                        "Cart is empty",
                        "Add a print before checking out."
                    );

                    return;
                }


                const order = {
                    id:
                        "PP-" +
                        Date.now(),

                    items:
                        cart,

                    total:
                        calculateCartTotal(),

                    createdAt:
                        new Date().toISOString()
                };


                const orders =
                    readStorage(
                        ORDERS_KEY,
                        []
                    );

                orders.push(order);

                writeStorage(
                    ORDERS_KEY,
                    orders
                );

                localStorage.removeItem(
                    CART_KEY
                );

                updateCartCount();

                showToast(
                    "Order received",
                    "Your Perfect Prints order has been saved."
                );


                setTimeout(() => {

                    window.location.href =
                        "index.html";

                }, 1200);
            }
        );
    }


    /* =========================================================
       CONTACT FORM
       ========================================================= */

    const contactForm =
        document.querySelector("#contactForm");

    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                showToast(
                    "Message ready",
                    "Thanks for contacting Perfect Prints."
                );

                contactForm.reset();
            }
        );
    }


    /* =========================================================
       ESCAPE HTML
       ========================================================= */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =========================================================
       INITIALISE
       ========================================================= */

    updateCartCount();
    updateWishlistCount();

    console.log(
        "Perfect Prints JavaScript loaded successfully."
    );

});
