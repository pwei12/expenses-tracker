This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Description

This is an expenses-tracker that is deployed on Vercel platform. It can be accessed [here](https://expenses-tracker-piwei.vercel.app).

## Features

- An user can sign up new account or login if an account has been created
- The user can logout after logging in
- Upon signing up/logging in, the user can add new expenses item
- A list of expenses items are shown in ascending order of date
- Each expenses item can be modified
- Each expenses item can also be deleted
- The sum of all expenses is shown at the bottom of the list
- Pie chart view on home page to show expenses by category

## Features to Add

- Allow user to sort expenses items by date in different orders
- Allow expenses items to be filtered by category or date
- Give options to group expenses items by category or date
- Add date picker to view expenses within certain range of date
- Add bar/line chart to show expenses in different years or months

## Tech

### Front-end

- Ant Design (UI library)
- NextJs (React framework)

### Back-end

- NextJs API Routes (Endpoint)
- MongoDb (Atlas) with Mongoose (Database)

### Testing Library

Cypress for end-to-end tests & component tests

## Requirements

- NodeJS: 14.16+

## Getting Started

### Installation

```bash
npm install
# or
yarn
```

### Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the home page.

## Other Commands

### Run Component tests

```bash
npm run cypress:open:component
# or
yarn cypress:open:component
```

### Run Development Server and Open E2E GUI

```bash
npm run dev:cy:open
# or
yarn dev:cy:open
```

### Run Development Server and Run E2E in CLI

```bash
npm run dev:cy:run
# or
yarn dev:cy:run
```

### Run E2E in GUI

```bash
npm run cypress:open
# or
yarn cypress:open
```

### Run E2E in CLI

```bash
npm run cypress:run
# or
yarn cypress:run
```
