const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");
const selectionDialog = document.querySelector("#selection-dialog");
const selectionList = document.querySelector("#selection-list");
const selectionEmpty = document.querySelector("#selection-empty");
const selectionStatus = document.querySelector("#selection-status");
const copySelectionButton = document.querySelector("#copy-selection");
const copyFallback = document.querySelector("#selection-copy-fallback");
const selectedProducts = new Set();

function updateSelection() {
  const count = selectedProducts.size;

  document.querySelectorAll(".selection-count").forEach((counter) => {
    counter.textContent = String(count);
    counter.setAttribute(
      "aria-label",
      `${count} ${count === 1 ? "item" : "items"} selected`,
    );
  });

  selectionList.replaceChildren();
  selectedProducts.forEach((product) => {
    const item = document.createElement("li");
    const name = document.createElement("span");
    const remove = document.createElement("button");

    name.textContent = product;
    remove.className = "selection-remove";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${product} from selection`);
    remove.addEventListener("click", () => {
      selectedProducts.delete(product);
      updateSelection();
      selectionStatus.textContent = "";
    });

    item.append(name, remove);
    selectionList.append(item);
  });

  selectionEmpty.hidden = count > 0;
  copySelectionButton.disabled = count === 0;

  document.querySelectorAll("[data-select-product]").forEach((button) => {
    const product = button.dataset.selectProduct;
    const isSelected = selectedProducts.has(product);
    button.setAttribute("aria-pressed", String(isSelected));
    button.innerHTML = isSelected
      ? 'Added to selection <span aria-hidden="true">✓</span>'
      : 'Add to selection <span aria-hidden="true">+</span>';
  });
}

function openSelection() {
  selectionStatus.textContent = "";
  selectionDialog.showModal();
}

document.querySelectorAll("[data-select-product]").forEach((button) => {
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => {
    const product = button.dataset.selectProduct;

    if (selectedProducts.has(product)) {
      selectedProducts.delete(product);
    } else {
      selectedProducts.add(product);
    }

    updateSelection();
  });
});

document.querySelectorAll("[data-open-selection]").forEach((button) => {
  button.addEventListener("click", openSelection);
});

document.querySelectorAll("[data-close-selection]").forEach((button) => {
  button.addEventListener("click", () => selectionDialog.close());
});

copySelectionButton.addEventListener("click", async () => {
  const orderNote = [
    "BURNING TREE selection request",
    ...Array.from(selectedProducts, (product) => `- ${product} (preview item; price to be confirmed)`),
    "",
    "Please confirm product availability and pricing.",
  ].join("\n");

  try {
    await navigator.clipboard.writeText(orderNote);
    copyFallback.hidden = true;
    selectionStatus.textContent =
      "Selection details copied. The preview cannot place an order; share the note using the brand's official contact once available.";
  } catch {
    copyFallback.value = orderNote;
    copyFallback.hidden = false;
    copyFallback.focus();
    copyFallback.select();
    selectionStatus.textContent =
      "Copy was blocked. The order note is selected above so you can copy it manually.";
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

updateSelection();
