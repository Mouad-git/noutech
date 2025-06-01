// Variable pour stocker les données de produits
let productData = {
    products: [] // Sera rempli avec vos données JSON
};

// Fonction pour charger les données JSON
async function loadProductData() {
    try {
        // Remplacez cette URL par le chemin vers votre fichier JSON
        const response = await fetch('/assets/data/products.json');
        productData = await response.json();
        return productData;
    } catch (error) {
        console.error("Erreur lors du chargement des données produits:", error);
    }
}

// Fonction pour initialiser la barre de recherche
function initSearchBar() {
    const searchInput = document.getElementById('search-input');
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    // Charger les données produits au chargement de la page
    loadProductData();
    
    // Événement pour détecter les saisies dans la barre de recherche
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        // Si la requête est vide, cacher les suggestions
        if (query.length === 0) {
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.classList.add('hidden');
            return;
        }
        
        // Filtrer les produits correspondant à la requête
        const matchingProducts = productData.products.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query)
        );
        
        // Limiter à 8 suggestions maximum
        const limitedProducts = matchingProducts.slice(0, 8);
        
        // Afficher les suggestions
        displaySuggestions(limitedProducts, query, suggestionsContainer);
    });
    
    // Fermer les suggestions quand on clique ailleurs
    document.addEventListener('click', function(e) {
        if (!suggestionsContainer.contains(e.target) && e.target !== searchInput) {
            suggestionsContainer.classList.add('hidden');
        }
    });
    
    // Événement pour la touche Entrée dans la barre de recherche
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.toLowerCase().trim();
            if (query.length > 0) {
                // Rediriger vers une page de résultats de recherche
                window.location.href = `/search-results.html?query=${encodeURIComponent(query)}`;
            }
        }
    });
}

// Fonction pour afficher les suggestions
function displaySuggestions(products, query, container) {
    // Vider le conteneur de suggestions
    container.innerHTML = '';
    
    // Si aucun produit trouvé, masquer le conteneur
    if (products.length === 0) {
        container.classList.add('hidden');
        return;
    }
    
    // Créer l'en-tête des suggestions
    const header = document.createElement('div');
    header.className = 'suggestions-header';
    header.textContent = 'Suggestions de recherche';
    container.appendChild(header);
    
    // Créer la liste des suggestions
    const suggestionsList = document.createElement('div');
    suggestionsList.className = 'suggestions-list';
    
    // Ajouter chaque produit à la liste
    products.forEach(product => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        
        // Icône de recherche
        const icon = document.createElement('span');
        icon.className = 'suggestion-icon';
        icon.innerHTML = '<i class="fas fa-search"></i>'; // Assurez-vous d'inclure Font Awesome
        
        // Nom du produit
        const name = document.createElement('span');
        name.className = 'suggestion-name';
        name.textContent = product.name;
        
        // Ajouter les éléments à l'item
        item.appendChild(icon);
        item.appendChild(name);
        
        // ⚠️ Ligne modifiée ici ⚠️
        item.addEventListener('click', function() {
            window.location.href = `/assets/html/productdetail.html?id=${product.id}`;
        });
        
        // Ajouter l'item à la liste
        suggestionsList.appendChild(item);
    });
    
    // Ajouter la liste au conteneur
    container.appendChild(suggestionsList);
    
    // Ajouter un lien "Voir tous les résultats"
    const viewAll = document.createElement('div');
    viewAll.className = 'view-all-results';
    viewAll.textContent = `Voir tous les résultats pour "${query}"`;
    viewAll.addEventListener('click', function() {
        window.location.href = `/search-results.html?query=${encodeURIComponent(query)}`;
    });
    
    container.appendChild(viewAll);
    
    // Afficher le conteneur
    container.classList.remove('hidden');
}

// Initialiser la barre de recherche quand le DOM est chargé
document.addEventListener('DOMContentLoaded', initSearchBar);






// Gestionnaire de toggle pour mobile
document.querySelector('[data-search-toggler]').addEventListener('click', function() {
    const searchWrapper = document.querySelector('.input-wrapper');
    searchWrapper.classList.toggle('active');
});

  