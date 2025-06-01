async function loadFavorites() {
  const response = await fetch('/assets/data/products.json');
  const products = await response.json();
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  
  const favoriteProducts = products.filter(product => favorites.includes(product.id));
  const favoritesTable = document.querySelector("#favorites tbody");

  // Si aucun favori
  if (favoriteProducts.length === 0) {
      favoritesTable.innerHTML = "<tr><td colspan='4'>Aucun favori pour le moment.</td></tr>";
      return;
  }

  function getStockStatus(stock) {
    return stock > 0 
        ? '<span class="in-stock">En stock</span>' 
        : '<span class="out-of-stock">Out of Stock</span>';
}


  // Afficher les favoris
  favoritesTable.innerHTML = favoriteProducts.map(product => `
      <tr>
          <td class="product-info">
          <button class="remove-favorite" onclick="removeFavorite(${product.id})">×</button>
          <img src="${product.images[0]}" alt="${product.name}" class="imgProduit">
          <span class="product-name">${product.name}</span>
          </td>
          <td class="price">${product.currentPrice}</td>
          <td>${getStockStatus(product.stock)}</td>
          <td>
              <button class="add-to-cart">Add To Cart</button>
          </td>
      </tr>
  `).join('');
}

function removeFavorite(productId) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter(id => id !== productId);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  loadFavorites(); // Recharger la liste
}

document.addEventListener("DOMContentLoaded", loadFavorites);
