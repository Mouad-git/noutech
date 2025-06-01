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

  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const id = event.queryStringParameters?.id;
    
    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'ID requis' })
      };
    }

    // Lire les données actuelles
    const productsPath = path.join(process.cwd(), 'data', 'products.json');
    const productsFile = fs.readFileSync(productsPath, 'utf8');
    const products = JSON.parse(productsFile);

    // Trouver et supprimer le produit
    const productIndex = products.products.findIndex(p => p.id === parseInt(id));
    
    if (productIndex === -1) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Produit non trouvé' })
      };
    }

    const deletedProduct = products.products.splice(productIndex, 1)[0];

    // Sauvegarder
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

    // Synchroniser avec GitHub
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
      await syncWithGitHub(products);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Produit supprimé avec succès',
        deletedProduct
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
    
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: 'data/products.json'
    });

    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: 'data/products.json',
      message: 'Suppression produit via admin',
      content: Buffer.from(JSON.stringify(products, null, 2)).toString('base64'),
      sha: data.sha
    });

  } catch (error) {
    console.error('Erreur sync GitHub:', error);
  }
}