async function initHome() {
    const listContainer = document.getElementById('recipe-list');

    try {
        const response = await fetch('./data/recipes.json');
        if (!response.ok) {
            throw new Error(`Failed to load recipe index: ${response.statusText}`);
        }
        const recipeIndex = await response.json();

        listContainer.innerHTML = '';
        
        recipeIndex.recipes.forEach(recipe => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `./recipe.html?slug=${encodeURIComponent(recipe.slug)}`;
            a.textContent = recipe.title;
            
            li.appendChild(a);
            if (recipe.yield) {
                const span = document.createElement('span');
                span.className = 'recipe-yield';
                span.textContent = ` (${recipe.yield})`;
                li.appendChild(span);
            }
            
            listContainer.appendChild(li);
        });
    } catch (error) {
        console.error(error);
        listContainer.innerHTML = '<p class="error">Could not load recipes.</p>';
    }
}

initHome();
