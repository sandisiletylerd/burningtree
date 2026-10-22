const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");
const cartDialog = document.querySelector("#cart-dialog");
const cartList = document.querySelector("#cart-list");
const cartEmpty = document.querySelector("#cart-empty");
const cartSubtotal = document.querySelector("#cart-subtotal");
const cartStatus = document.querySelector("#cart-status");
const checkoutForm = document.querySelector("#checkout-form");
const checkoutButton = document.querySelector("#checkout-button");
const sendOrderLink = document.querySelector("#send-order-link");
const copyOrderButton = document.querySelector("#copy-order");
const orderCopyFallback = document.querySelector("#order-copy-fallback");
const cartItems = new Map();

function formatRand(amount) {
  return `R${amount.toLocaleString("en-US")}`;
}

function getCartCount() {
  return Array.from(cartItems.values()).reduce(
    (count, item) => count + item.quantity,
    0,
  );
}

function getCartSubtotal() {
  return Array.from(cartItems.values()).reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
}

function addCartButtonContent(button, text) {
  button.replaceChildren(document.createTextNode(text));
  const icon = document.createElement("span");
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "+";
  button.append(" ", icon);
}

function renderCart() {
  const count = getCartCount();
  const hasItems = count > 0;

  document.querySelectorAll(".cart-count").forEach((counter) => {
    counter.textContent = String(count);
    counter.setAttribute(
      "aria-label",
      `${count} ${count === 1 ? "item" : "items"} in cart`,
    );
  });

  cartList.replaceChildren();

  cartItems.forEach((item, key) => {
    const row = document.createElement("li");
    row.className = "cart-item";

    const details = document.createElement("div");
    details.className = "cart-item__details";

    const name = document.createElement("strong");
    name.textContent = item.name;

    const variant = document.createElement("span");
    variant.textContent = `${item.color} · Size ${item.size} · ${formatRand(item.price)} each`;

    const lineTotal = document.createElement("span");
    lineTotal.className = "cart-item__total";
    lineTotal.textContent = formatRand(item.price * item.quantity);

    details.append(name, variant, lineTotal);

    const controls = document.createElement("div");
    controls.className = "cart-item__controls";
    controls.setAttribute("aria-label", `${item.name} quantity`);

    const decrease = document.createElement("button");
    decrease.className = "quantity-button";
    decrease.type = "button";
    decrease.textContent = "−";
    decrease.setAttribute("aria-label", `Decrease ${item.name} quantity`);
    decrease.addEventListener("click", () => {
      if (item.quantity === 1) {
        cartItems.delete(key);
      } else {
        item.quantity -= 1;
      }
      renderCart();
    });

    const quantity = document.createElement("span");
    quantity.className = "cart-item__quantity";
    quantity.setAttribute("aria-label", `Quantity ${item.quantity}`);
    quantity.textContent = String(item.quantity);

    const increase = document.createElement("button");
    increase.className = "quantity-button";
    increase.type = "button";
    increase.textContent = "+";
    increase.setAttribute("aria-label", `Increase ${item.name} quantity`);
    increase.addEventListener("click", () => {
      item.quantity += 1;
      renderCart();
    });

    const remove = document.createElement("button");
    remove.className = "selection-remove";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${item.name} from cart`);
    remove.addEventListener("click", () => {
      cartItems.delete(key);
      renderCart();
    });

    controls.append(decrease, quantity, increase, remove);
    row.append(details, controls);
    cartList.append(row);
  });

  cartEmpty.hidden = hasItems;
  cartSubtotal.textContent = formatRand(getCartSubtotal());
  checkoutButton.disabled = !hasItems;

  if (!hasItems) {
    sendOrderLink.hidden = true;
    copyOrderButton.hidden = true;
    orderCopyFallback.hidden = true;
  }
}

function openCart() {
  cartStatus.textContent = "";
  cartDialog.showModal();
}

document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");
    const color = card.querySelector('[data-option="color"]').value;
    const size = card.querySelector('[data-option="size"]').value;
    const key = `${button.dataset.id}|${color}|${size}`;
    const existingItem = cartItems.get(key);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.set(key, {
        id: button.dataset.id,
        name: button.dataset.name,
        price: Number(button.dataset.price),
        color,
        size,
        quantity: 1,
      });
    }

    cartStatus.textContent = "";
    renderCart();
    button.setAttribute("aria-label", `${button.dataset.name} added to cart`);
    addCartButtonContent(button, "Added to cart");
    window.setTimeout(() => {
      button.setAttribute("aria-label", `Add ${button.dataset.name} to cart`);
      addCartButtonContent(button, "Add to cart");
    }, 1200);
  });
});

document.querySelectorAll("[data-open-cart]").forEach((button) => {
  button.addEventListener("click", openCart);
});

document.querySelectorAll("[data-close-cart]").forEach((button) => {
  button.addEventListener("click", () => cartDialog.close());
});

function buildOrderMessage(formValues) {
  const lines = [
    "BURNING TREE ORDER REQUEST",
    "",
    ...Array.from(cartItems.values(), (item) =>
      `${item.quantity} x ${item.name} — ${item.color}, size ${item.size} — ${formatRand(item.price * item.quantity)}`,
    ),
    "",
    `Items subtotal: ${formatRand(getCartSubtotal())}`,
    "Delivery: please confirm the cost and availability.",
    "",
    "CUSTOMER DETAILS",
    `Name: ${formValues.get("name")}`,
    `Email: ${formValues.get("email")}`,
    `Phone: ${formValues.get("phone")}`,
    `Delivery address: ${formValues.get("address")}`,
    "",
    "This is an order request, not proof of payment or a confirmed order.",
  ];

  return lines.join("\n");
}

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  cartStatus.textContent = "";

  if (cartItems.size === 0) {
    cartStatus.textContent = "Add an item to your cart before preparing an order request.";
    return;
  }

  if (!checkoutForm.reportValidity()) {
    return;
  }

  const formValues = new FormData(checkoutForm);
  const orderMessage = buildOrderMessage(formValues);
  const subject = encodeURIComponent("BURNING TREE order request");
  const body = encodeURIComponent(orderMessage);

  sendOrderLink.href = `mailto:burningtree@gmail.com?subject=${subject}&body=${body}`;
  sendOrderLink.hidden = false;
  copyOrderButton.hidden = false;
  orderCopyFallback.value = orderMessage;
  orderCopyFallback.hidden = true;
  cartStatus.textContent =
    "Your request is ready. Open the email draft below and press Send in your email app. No payment has been taken.";
});

copyOrderButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(orderCopyFallback.value);
    orderCopyFallback.hidden = true;
    cartStatus.textContent =
      "Order details copied. Email them to burningtree@gmail.com to send your unpaid request.";
  } catch {
    orderCopyFallback.hidden = false;
    orderCopyFallback.focus();
    orderCopyFallback.select();
    cartStatus.textContent =
      "Copy was blocked. The order details are selected above so you can copy them into an email.";
  }
});

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";

  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute(
    "aria-label",
    isExpanded ? "Open navigation" : "Close navigation",
  );
  primaryNavigation.classList.toggle("is-open", !isExpanded);
});

primaryNavigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    primaryNavigation.classList.remove("is-open");
  });
});

document.querySelector("#drop-form").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#drop-status").textContent =
    "Drop-list signup is not connected yet. Your email was not sent or saved.";
  event.currentTarget.reset();
});

document.querySelector("#current-year").textContent = String(
  new Date().getFullYear(),
);

renderCart();
