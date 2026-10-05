// js/renderer.js
export function renderRecipe(recipe) {
    const container = document.getElementById('recipe-container');
    
    // Header section
    const headerSection = document.createElement('section');
    headerSection.innerHTML = `
        <h1>${escapeHtml(recipe.title)}</h1>
        <div class="metadata">
            ${recipe.prepTime ? `<p><span><b>Prep:</b></span> ${escapeHtml(recipe.prepTime)}</p>` : ''}
            ${recipe.cookTime ? `<p><span><b>Bake:</b></span> ${escapeHtml(recipe.cookTime)}</p>` : ''}
            ${recipe.ovenTemperature ? `<p><span><b>Oven:</b></span> ${recipe.ovenTemperature.value}&deg;${recipe.ovenTemperature.unit}</p>` : ''}
            ${recipe.yield ? `<p><span><b>Makes:</b></span> ${escapeHtml(recipe.yield)}</p>` : ''}
        </div>
    `;

    // Ingredients section
    const ingredientsSection = document.createElement('section');
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');

    recipe.ingredients.forEach(ing => {
        const tr = document.createElement('tr');
        
        // Format amount and unit
        let quantityStr = '';
        if (ing.amount !== undefined) {
            quantityStr += formatAmount(ing.amount);
        }
        if (ing.unit) {
            quantityStr += formatUnit(ing.amount, ing.unit);
        }

        // Format name and preparation/optional modifiers
        let itemStr = ing.name;
        if (ing.preparation) {
            itemStr += `, ${ing.preparation}`;
        }
        if (ing.optional) {
            itemStr += ' (optional)';
        }

        tr.innerHTML = `
            <td class="ingredient-amount">${escapeHtml(quantityStr.trim())}</td>
            <td class="ingredient-name">${escapeHtml(itemStr)}</td>
        `;
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    ingredientsSection.appendChild(table);

    // Instructions section
    const instructionsSection = document.createElement('section');
    const ol = document.createElement('ol');

    recipe.instructions.forEach(inst => {
        const li = document.createElement('li');
        li.textContent = inst.text;
        ol.appendChild(li);
    });

    instructionsSection.appendChild(ol);

    // Clear container and append new structure
    container.innerHTML = '';
    container.appendChild(headerSection);
    container.appendChild(ingredientsSection);
    container.appendChild(instructionsSection);
}

function formatAmount(amount) {
    // Basic decimal to clean fraction conversion for standard baking quantities
    const fractions = {
        0.25: '1/4',
        0.33: '1/3',
        0.375: '3/8',
        0.5: '1/2',
        0.66: '2/3',
        0.75: '3/4',
        0.875: '7/8'
    };
    const whole = Math.floor(amount);
    const remainder = parseFloat((amount - whole).toFixed(3));
    
    if (remainder === 0) return whole > 0 ? whole.toString() : '';
    const fracStr = fractions[remainder] || remainder.toString().replace('0.', '');
    return whole > 0 ? `${whole} ${fracStr}` : fracStr;
}

// Only contains units that change from their default form (see recipe.schema.json)
const UNIT_MAP = {
  cup: { singular: 'cup', plural: 'cups' },
  clove: { singular: 'clove', plural: 'cloves' },
  stick: { singular: 'stick', plural: 'sticks' },
  pkg: { singular: 'pkg', plural: 'pkgs' },
  can: { singular: 'can', plural: 'cans' }
};

function formatUnit(amount, unit) {
    const mapping = UNIT_MAP[unit];
    if (!mapping) return ' ' + unit;
    return (amount <= 1) ? ' ' + mapping.singular : ' ' + mapping.plural;
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
