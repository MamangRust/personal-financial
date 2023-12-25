# Personal Financial Management App

This application is designed to help users manage their finances effectively. It includes features for tracking transactions, setting budgets, managing goals, and more.

## Technologies Used

- **Tauri**: Used to create a cross-platform desktop application wrapper.
- **React**: Frontend framework for building the user interface.
- **SQLite**: Database for storing user and financial data.
- **Ant Design**: UI library for building components and styling the application.

## Features

### User Authentication

- Allows users to sign up, log in, and manage their accounts securely.

### Transaction Management

- Track income, expenses, and transfers.
- Categorize transactions for better organization.
- View transaction history with details.

### Budgeting

- Set budgets for different expense categories.
- Monitor budget utilization and get s for overspending.

### Goal Setting

- Create financial goals with target amounts and deadlines.
- Track progress towards achieving goals.

## How to Run the Application

### Prerequisites

- Node.js and npm installed
- Rust and Cargo installed
- Tauri CLI installed globally

### Steps to Run

1. **Clone the Repository**

   ```bash
   git clone https://github.com/MamangRust/personal-financial-management.git
   cd personal-financial-app

2. **Install Depencies**
   ```bash
    yarn install
   ```
3. **Install Depencies src-tauri**
    ```bash
    cd src-tauri

    cargo build

    ```

4. **Build tauri App**
    ```bash
    yarn tauri build
    
    running on release folder src-tauri
    ```

## Demo App

![Demo-App](/images/image.png)