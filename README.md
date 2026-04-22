# Employee Directory API

![CI Status](https://github.com/gadithirupathi12/npm-project/actions/workflows/ci.yml/badge.svg)

A simple Employee Directory REST API built with Node.js, Express, and SQLite.

## Tech Stack
- Node.js + Express
- better-sqlite3
- Jest + Supertest

## Setup
npm install
npm start

## Run Tests
npm test

## API Endpoints
- GET  /employees  → Get all employees
- POST /employees  → Add new employee (body: { "name": "Alice" })