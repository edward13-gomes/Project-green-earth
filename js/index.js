const API_BASE = "https://openapi.programming-hero.com/api";

let cart = [];

// ---------- Spinner ----------
const manageSpinner = (status) => {
  const spinner = document.getElementById("loading-spinner");
  const treeCards = document.getElementById("tree-cards");

  if (status) {
    spinner.classList.remove("hidden");
    treeCards.classList.add("hidden");
  } else {
    spinner.classList.add("hidden");
    treeCards.classList.remove("hidden");
  }
};

// ---------- Categories ----------
const loadCategories = async () => {
  const res = await fetch(`${API_BASE}/categories`);
  const json = await res.json();

  displayCategories(json.categories);
};

const displayCategories = (categories) => {
  const categoryList = document.getElementById("category-list");

  categoryList.innerHTML = "";

  const allButton = document.createElement("button");

  allButton.id = "category-btn-all";
  allButton.innerText = "All Trees";
  allButton.className =
    "category-btn active-category text-left px-3 py-2 rounded-md hover:bg-green-100 transition text-gray-700";

  allButton.onclick = () => {
    document.querySelectorAll(".category-btn").forEach((button) => {
      button.classList.remove("active-category");
    });

    allButton.classList.add("active-category");

    loadAllTrees();
  };

  categoryList.appendChild(allButton);

  categories.forEach((category) => {
    const button = document.createElement("button");

    button.id = `category-btn-${category.id}`;
    button.innerText = category.category_name;

    button.className =
      "category-btn text-left px-3 py-2 rounded-md hover:bg-green-100 transition text-gray-700";

    button.onclick = () => {
      document.querySelectorAll(".category-btn").forEach((button) => {
        button.classList.remove("active-category");
      });

      button.classList.add("active-category");

      loadTreesByCategory(category.id);
    };

    categoryList.appendChild(button);
  });
};

// ---------- All Trees ----------
const loadAllTrees = async () => {
  manageSpinner(true);

  const res = await fetch(`${API_BASE}/plants`);
  const json = await res.json();

  displayTrees(json.plants);

  manageSpinner(false);
};

// ---------- Trees By Category ----------
const loadTreesByCategory = async (id) => {
  manageSpinner(true);

  const res = await fetch(`${API_BASE}/category/${id}`);
  const json = await res.json();

  displayTrees(json.plants);

  manageSpinner(false);
};

// ---------- Display Trees ----------
const displayTrees = (trees) => {
  const treeCards = document.getElementById("tree-cards");

  treeCards.innerHTML = "";

  if (trees.length === 0) {
    treeCards.innerHTML = `
      <p class="text-gray-500 text-sm col-span-full text-center py-10">
        No trees found in this category.
      </p>
    `;

    return;
  }

  trees.forEach((tree) => {
    const card = document.createElement("div");

    card.className =
      "bg-white border border-green-100 rounded-xl p-4 flex flex-col shadow-sm hover:shadow-md transition";

    card.innerHTML = `
      <div class="bg-green-50 rounded-lg h-36 mb-3 flex items-center justify-center overflow-hidden">

        <img
          src="${tree.image}"
          alt="${tree.name}"
          class="w-full h-full object-cover"
        >

      </div>

      <button
        onclick="loadWordDetail(${tree.id})"
        class="tree-name-btn text-left font-semibold text-green-900 mb-1">
        ${tree.name}
      </button>

      <p class="text-xs text-gray-500 mb-3 line-clamp-2">
        ${tree.description}
      </p>

      <div class="flex items-center justify-between text-xs mb-3">

        <span class="text-green-700">
          ${tree.category}
        </span>

        <span class="font-semibold text-gray-900">
          $${Number(tree.price).toFixed(0)}
        </span>

      </div>

      <button
        onclick="addToCart(${tree.id}, '${tree.name}', ${tree.price})"
        class="mt-auto bg-green-700 hover:bg-green-800 text-white text-sm font-medium py-2 rounded-md transition">
        Add to Cart
      </button>
    `;

    treeCards.appendChild(card);
  });
};

// ---------- Tree Details ----------
const loadWordDetail = async (id) => {
  const res = await fetch(`${API_BASE}/plant/${id}`);
  const json = await res.json();

  displayTreeDetails(json.plants[0]);
};

const displayTreeDetails = (tree) => {
  const modalBody = document.getElementById("modal-body");

  modalBody.innerHTML = `
    <img
      src="${tree.image}"
      alt="${tree.name}"
      class="w-full h-48 object-cover rounded-lg"
    >

    <h3 class="text-xl font-bold text-green-900">
      ${tree.name}
    </h3>

    <span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full w-fit">
      ${tree.category}
    </span>

    <p class="text-sm text-gray-600">
      ${tree.description}
    </p>

    <p class="font-semibold text-green-900">
      $${Number(tree.price).toFixed(0)}
    </p>
  `;

  document.getElementById("tree-modal").classList.remove("hidden");
};

// ---------- Close Modal ----------
document.getElementById("modal-close").addEventListener("click", () => {
  document.getElementById("tree-modal").classList.add("hidden");
});

document.getElementById("tree-modal").addEventListener("click", (e) => {
  if (e.target.id === "tree-modal") {
    document.getElementById("tree-modal").classList.add("hidden");
  }
});

// ---------- Cart ----------
const addToCart = (id, name, price) => {
  cart.push({
    id: id,
    name: name,
    price: price
  });

  displayCart();
};

const removeFromCart = (index) => {
  cart.splice(index, 1);

  displayCart();
};

const displayCart = () => {
  const cartList = document.getElementById("cart-list");

  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = `
      <li class="text-gray-400 text-xs">
        Your cart is empty.
      </li>
    `;
  }

  cart.forEach((item, index) => {
    const li = document.createElement("li");

    li.className =
      "flex items-center justify-between bg-white rounded-md px-3 py-2";

    li.innerHTML = `
      <span class="truncate">

        <span class="block text-gray-800 font-medium">
          ${item.name}
        </span>

        <span class="block text-gray-400 text-xs">
          $${Number(item.price).toFixed(0)} x 1
        </span>

      </span>

      <button
        onclick="removeFromCart(${index})"
        class="text-gray-400 hover:text-red-500 px-1">
        &times;
      </button>
    `;

    cartList.appendChild(li);
  });

  let total = 0;

  cart.forEach((item) => {
    total = total + Number(item.price);
  });

  document.getElementById("cart-total").innerText =
    Number(total).toFixed(0);
};

// ---------- Pledge Form ----------
document.getElementById("pledge-form").addEventListener("submit", (e) => {
  e.preventDefault();

  alert("Thank you for committing to plant a tree! 🌱");

  e.target.reset();
});

// ---------- Start ----------
loadCategories();
loadAllTrees();