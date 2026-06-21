/**
 * @fileoverview Frontend common utilities for SynergyMaker application.
 * Handles API communication and navigation setup.
 * @module public/js/main
 */

/**
 * Fetch data from API endpoints
 * Makes a fetch request to the specified URL and parses JSON response.
 * Logs errors to console if request fails.
 * @function fetchAPI
 * @param {string} url - API endpoint URL
 * @param {Object} [options={}] - Fetch options (headers, method, body, etc.)
 * @returns {Promise<Object|undefined>} Parsed JSON response or undefined on error
 * @example
 * const roles = await fetchAPI('/api/roles');
 * const newRole = await fetchAPI('/api/roles', {
 *   method: 'POST',
 *   headers: {'Content-Type': 'application/json'},
 *   body: JSON.stringify({name: 'DevOps'})
 * });
 */
async function fetchAPI(url, options = {}) {
    try {
        const res = await fetch(url, options);
        return await res.json();
    } catch (e) {
        console.error("API error", e);
    }
}

/**
 * Initialize main navigation on page load
 * Sets up the header with site title and navigation links
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', async () => {
    /**
     * Navigation header HTML template
     * Includes links to main sections: dashboard, person management, roles, relations, team creation, search
     * @type {string}
     */
    document.querySelector('header').innerHTML = `<h2>SynergyMaker</h2>
        <nav>
            <a href="/">Strona główna</a>
            <a href="/add-person">Dodaj osobę</a>
            <a href="/add-role">Dodaj rolę</a>
            <a href="/manage-relations">Zarządzaj relacjami</a>
            <a href="/team-creator">Kreator zespółów</a>
            <a href="/search">Wyszukaj osobę</a>
        </nav>`
});

