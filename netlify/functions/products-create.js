const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const productData = JSON.parse(event.body);
    
    // Validation
    const required = ['name', 'description', 'currentPrice', 'category', 'state', 'stock'];
    for (const field of required) {
      if (!productData[field]) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: `Le champ '${field}' est requis` })
        };
      }
    }

    // Lire les données actuelles
    const productsPath = path.join(process.cwd(), 'data', 'products.json');
    const productsFile = fs.readFileSync(productsPath, 'utf8');
    const products = JSON.parse(productsFile);

    // Générer un nouvel ID
    const maxId = products.products.length > 0 
      ? Math.max(...products.products.map(p => p.id)) 
      : 0;
    
    const newProduct = {
      id: maxId + 1,
      name: productData.name.trim(),
      description: productData.description.trim(),
      currentPrice: parseFloat(productData.currentPrice),
      category: productData.category.trim(),
      state: productData.state,
      stock: productData.stock,
      images: productData.images || []
    };

    // Ajouter le produit
    products.products.push(newProduct);

    // Sauvegarder localement (pour le build actuel)
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

    // Synchroniser avec GitHub si configuré
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
      await syncWithGitHub(products);
    }

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Produit créé avec succès',
        product: newProduct
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

async function syncWithGitHub(products) {
  try {
    const [owner, repo] = process.env.GITHUB_REPO.split('/');
    
    // Obtenir le SHA actuel du fichier
    let sha;
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: 'data/products.json'
      });
      sha = data.sha;
    } catch (error) {
      // Le fichier n'existe pas encore
    }

    // Mettre à jour le fichier
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: 'data/products.json',
      message: 'Mise à jour des produits via admin',
      content: Buffer.from(JSON.stringify(products, null, 2)).toString('base64'),
      sha
    });

  } catch (error) {
    console.error('Erreur sync GitHub:', error);
  }
}