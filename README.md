# Restaurant App

A modern, full-stack mobile application for food ordering and delivery management. Built with React Native (Expo) and Supabase.

## Admin Dashboard / CMS
Manage the menu, view active orders, and update order status via the hosted CMS:
**[INSERT HOSTED CMS LINK HERE]**

---

## Features

-   **User Authentication**: Secure sign-up and login using Supabase Auth.
-   **Browse Menu**: View categories and products with detailed descriptions and images.
-   **Cart Management**: Add items, adjust quantities, and calculate totals.
-   **Secure Checkout**: integrated Stripe payments for credit card processing.
-   **Real-time Order Tracking**:
    -   Live status updates (Pending -> Preparing -> Out for Delivery -> Delivered).
    -   **Push Notifications**: Instant alerts when orders are approved.
    -   **ETA & Pickup Codes**: Automatically generated arrival times and secure verification codes.
-   **Order History**: View past orders and re-order favorites.
-   **Profile Management**: Manage delivery addresses and payment methods.

## Tech Stack

-   **Frontend**: React Native, Expo, TypeScript, NativeWind (Tailwind CSS).
-   **Backend**: Supabase (PostgreSQL, Auth, Realtime, Edge Functions).
-   **Payments**: Stripe.
-   **State Management**: React Hooks & Context API.

## Getting Started

### Prerequisites

-   Node.js (LTS)
-   Expo CLI
-   iOS Simulator or Android Emulator (or the Expo Go app on your physical device)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd ResturantApp
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your keys:
    ```env
    EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
    ```

4.  **Run the App**
    Start the development server:
    ```bash
    npx expo start
    ```
    *If you encounter network issues (especially with Supabase/Stripe connections on physical devices), use:*
    ```bash
    npx expo start --clear --tunnel
    ```

### Database Setup

ensure your Supabase project is configured with the necessary tables (`orders`, `menu_items`, `profiles`, etc.) and triggers.
-   Run the migration in `supabase/approval_trigger.sql` to enable auto-generation of pickup codes and ETAs.

## Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
