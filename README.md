# Shopping Online

React Native Expo shopping app with a PHP API for XAMPP/MySQL.

## Included Projects

- `src/`, `App.js`, `assets/`: mobile app built with Expo
- `shopping-api/api.php`: PHP backend used by the app

## Features

- Product browsing and checkout
- Address selection during checkout
- Pending payment flow
- PromptPay payment with QR generated through EasySlip
- TrueMoney Wallet payment flow
- Slip upload and verification through EasySlip
- Duplicate slip protection and mismatch rejection

## Tech Stack

- Frontend: React Native, Expo, React Navigation
- Backend: PHP, MySQL, XAMPP
- Payment verification: EasySlip

## Frontend Setup

1. Install dependencies:

```bash
npm install
```

2. Start Expo:

```bash
npm start
```

## Backend Setup

1. Put the backend folder in your web root, for example:

```text
C:\xampp\htdocs\shopping-api
```

2. Create a MySQL database named `shopping_db`.
3. Start Apache and MySQL in XAMPP.
4. Make sure the app points to the correct API URL in the frontend config.

## EasySlip

The backend expects an EasySlip access token on the server side only.

Recommended approach:

- Set `EASYSLIP_ACCESS_TOKEN` as an environment variable for Apache/PHP
- Do not store the token in the React Native app

## API URL Examples

- Android emulator: `http://10.0.2.2/shopping-api/api.php`
- iOS simulator or web: `http://localhost/shopping-api/api.php`
- Physical device on LAN: `http://YOUR_LAN_IP/shopping-api/api.php`

## Repository Notes

- `shopping-api/uploads/` is runtime data and should not be committed
- Secrets, production tokens, and database dumps should not be committed
- This repository currently keeps the mobile app and PHP API together for easier local development
