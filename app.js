document.addEventListener('DOMContentLoaded', ready);

function ready() {
  const quantityAdjusters = document.querySelectorAll('.quantity-adjuster');

  quantityAdjusters.forEach(adjuster => {
    const minusIcon = adjuster.querySelector('.fa-minus');
    const plusIcon = adjuster.querySelector('.fa-plus');
    const quantitySpan = adjuster.querySelector('.quantity');

    minusIcon.addEventListener('click', function() {
      let currentQuantity = parseInt(quantitySpan.textContent);
      if (currentQuantity > 1) { // Ensuring quantity doesn't go below 1
        quantitySpan.textContent = currentQuantity - 1;
        updateCartTotal();
        storeCartData();
      }
    });

    plusIcon.addEventListener('click', function() {
      let currentQuantity = parseInt(quantitySpan.textContent);
      quantitySpan.textContent = currentQuantity + 1;
      updateCartTotal();
      storeCartData();
    });
  });

  const removeCartItemButtons = document.getElementsByClassName('fa-trash-can');
  for (let i = 0; i < removeCartItemButtons.length; i++) {
    let button = removeCartItemButtons[i];
    button.addEventListener('click', removeCartItem);
  }

  const addToCartButtons = document.getElementsByClassName('shop-item-button');
  for (let i = 0; i < addToCartButtons.length; i++) {
    let button = addToCartButtons[i];
    button.addEventListener('click', addToCartClicked);
  }

  // Load cart data from localStorage
  loadCartData();
}

function removeCartItem(e) {
  let buttonClicked = e.target;
  buttonClicked.parentElement.parentElement.remove();
  updateCartTotal();
  storeCartData();
}

function addToCartClicked(e) {
  let button = e.target;
  let shopItem = button.parentElement.parentElement;
  let title = shopItem.getElementsByClassName('shop-item-title')[0].textContent;
  let price = shopItem.getElementsByClassName('shop-item-price')[0].textContent;
  let imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src;
  addItemToCart(title, price, imageSrc);
  updateCartTotal();
  storeCartData();
  // Redirect to cart page
  window.location.href = './cart.html';
}

function addItemToCart(title, price, imageSrc) {
  let cartRow = document.createElement('div');
  cartRow.classList.add('order'); // Added class to match existing orders
  let cartItems = document.getElementsByClassName('cart-list')[0];

  // Check if the cart-list element is found
  if (!cartItems) {
    console.error('Cart list not found!');
    return;
  }

  let cartRowContents = `
    <div class="image">
      <img src="${imageSrc}" alt="headphone">
      <div class="text">
        <h3>${title}</h3>
        <p>Color: <span>White</span></p>
        <h2 class="cart-price">${price}</h2>
      </div>
    </div>
    <div class="icons">
      <i class="fa-solid fa-trash-can fa-lg" style="color: #ff0000;"></i>
      <div class="increment">
        <p class="quantity-adjuster"> 
          <i class="fa-solid fa-minus"></i>&nbsp; &nbsp; 
          <span class="quantity">1</span> &nbsp; &nbsp;
          <i class="fa-solid fa-plus"></i>
        </p>
      </div>
    </div>
  `;

  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);

  // Add event listeners to the new elements
  cartRow.querySelector('.fa-trash-can').addEventListener('click', removeCartItem);
  cartRow.querySelector('.fa-minus').addEventListener('click', function() {
    let quantitySpan = cartRow.querySelector('.quantity');
    let currentQuantity = parseInt(quantitySpan.textContent);
    if (currentQuantity > 1) {
      quantitySpan.textContent = currentQuantity - 1;
      updateCartTotal();
      storeCartData();
    }
  });
  cartRow.querySelector('.fa-plus').addEventListener('click', function() {
    let quantitySpan = cartRow.querySelector('.quantity');
    let currentQuantity = parseInt(quantitySpan.textContent);
    quantitySpan.textContent = currentQuantity + 1;
    updateCartTotal();
    storeCartData();
  });
}

function updateCartTotal() {
  let cartItemContainer = document.getElementsByClassName('cart-list')[0];
  let cartRows = cartItemContainer.getElementsByClassName('order');
  let subTotal = 0;

  for (let i = 0; i < cartRows.length; i++) {
    let cartRow = cartRows[i];
    let priceElement = cartRow.getElementsByClassName('cart-price')[0];
    let quantityElement = cartRow.getElementsByClassName('quantity')[0];
    let price = parseFloat(priceElement.textContent.replace('$', ''));
    let quantity = parseInt(quantityElement.textContent);
    subTotal += price * quantity;
  }

  let subTotalTextElement = document.querySelector('.subtotal');
  let totalElement = document.querySelector('.total-price');
  let deliveryFee = parseFloat(document.querySelector('.delivery-fee').textContent.replace('$', ''));
  let total = subTotal + deliveryFee;

  subTotalTextElement.textContent = `$${subTotal.toFixed(0)}`;
  totalElement.textContent = `$${total.toFixed(0)}`;
}

function storeCartData() {
  let cartItems = document.getElementsByClassName('order');
  let cartData = [];

  for (let i = 0; i < cartItems.length; i++) {
    let cartItem = cartItems[i];
    let title = cartItem.querySelector('.text h3').textContent;
    let price = cartItem.querySelector('.cart-price').textContent;
    let imageSrc = cartItem.querySelector('img').src;
    let quantity = cartItem.querySelector('.quantity').textContent;

    cartData.push({ title, price, imageSrc, quantity });
  }

  localStorage.setItem('cartItems', JSON.stringify(cartData));
}

function loadCartData() {
  let cartData = localStorage.getItem('cartItems');
  if (!cartData) return;

  cartData = JSON.parse(cartData);
  cartData.forEach(item => {
    addItemToCart(item.title, item.price, item.imageSrc);

    // Update the quantity of the added item
    let cartItems = document.getElementsByClassName('order');
    let lastCartItem = cartItems[cartItems.length - 1];
    let quantitySpan = lastCartItem.querySelector('.quantity');
    quantitySpan.textContent = item.quantity;
  });

  updateCartTotal();
}
