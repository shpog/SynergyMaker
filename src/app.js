/**
 * @fileoverview Main Express application setup for SynergyMaker.
 * SynergyMaker is a system for selecting project teams based on synergy.
 * @module app
 */

const express = require('express');
const path = require('path');
const apiRouter = require('./routes/api');
const testingRouter = require('./routes/testing');

/**
 * Express application instance
 * @type {express.Application}
 */
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Dashboard page - displays the main interface
 * @route GET /
 * @returns {void} Sends dashboard.html
 */
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/views/dashboard.html')));

/**
 * Add person form page
 * @route GET /add-person
 * @returns {void} Sends add-person.html form
 */
app.get('/add-person', (req, res) => res.sendFile(path.join(__dirname, 'public/views/add-person.html')));

/**
 * Search page for finding people
 * @route GET /search
 * @returns {void} Sends search.html form
 */
app.get('/search', (req, res) => res.sendFile(path.join(__dirname, 'public/views/search.html')));

/**
 * Search results page
 * @route GET /search-results
 * @returns {void} Sends search-results.html
 */
app.get('/search-results', (req, res) => res.sendFile(path.join(__dirname, 'public/views/search-results.html')));

/**
 * Add role form page
 * @route GET /add-role
 * @returns {void} Sends add-role.html form
 */
app.get('/add-role', (req, res) => res.sendFile(path.join(__dirname, 'public/views/add-role.html')));

/**
 * Team creator/optimizer page
 * @route GET /team-creator
 * @returns {void} Sends team-creator.html
 */
app.get('/team-creator', (req, res) => res.sendFile(path.join(__dirname, 'public/views/team-creator.html')));

/**
 * Manage relations between team members
 * @route GET /manage-relations
 * @returns {void} Sends manage-relations.html
 */
app.get('/manage-relations', (req, res) => res.sendFile(path.join(__dirname, 'public/views/manage-relations.html')));

// API routes
app.use('/api', apiRouter);

// Testing/data loading routes
app.use('/testing', testingRouter);

/**
 * Start the Express server
 * @listens {number} PORT
 */
app.listen(PORT, () => {
    console.log(`SynergyMaker running on port ${PORT}`);
});