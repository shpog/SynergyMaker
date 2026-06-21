/**
 * @fileoverview Database connection module for Neo4j.
 * Manages Neo4j driver initialization and session creation.
 * @module db
 */

const neo4j = require('neo4j-driver');

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'password123';

/**
 * Neo4j driver instance configured with authentication and options.
 * @type {neo4j.Driver}
 */
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
    disableLosslessIntegers: true
});

/**
 * Creates a new Neo4j session for database operations.
 * @function
 * @returns {neo4j.Session} A new database session for executing queries
 * @example
 * const session = getSession();
 * const result = await session.run('MATCH (n) RETURN n');
 * await session.close();
 */
function getSession() {
    return driver.session();
}

module.exports = {
    driver,
    getSession
};