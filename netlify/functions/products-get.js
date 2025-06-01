const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Lire le fichier products.json
    const productsPath = path.join(process.cwd(), 'data', 'products.json');
    const productsData = fs.readFileSync(productsPath, 'utf8');
    const products = JSON.parse(productsData);

    // Filtres optionnels
    const { search, category, stock } = event.queryStringParameters || {};
    
    let filteredProducts = products.products || [];

    if (search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    if (stock) {
      filteredProducts = filteredProducts.filter(p => p.stock === stock);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        products: filteredProducts,
        total: filteredProducts.length
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erreur serveur: ' + error.message })
    };
  }
};