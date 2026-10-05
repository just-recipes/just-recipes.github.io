// js/app.js
import { renderRecipe } from './renderer.js';

async function init() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug') || 'banana-bread'; // default fallback

    try {
        const response = await fetch(`./data/${slug}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load recipe: ${response.statusText}`);
        }
        const recipe = await response.json();
        renderRecipe(recipe);
        document.title = `${recipe.title} - Just Recipes`;
    } catch (error) {
        console.error(error);
        document.getElementById('recipe-container').innerHTML = `
            <p class="error">Could not load recipe data. Please try again later.</p>
        `;
    }
}

init();
