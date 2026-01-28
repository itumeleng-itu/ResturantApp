# System Documentation: Restaurant Application

## 1. Executive Summary

This document serves as the technical documentation for the Restaurant Application. The system is a mobile application designed for food ordering, delivery tracking, and user account management. It relies on a modern serverless architecture utilizing React Native for the client interface and Supabase for backend services, with Stripe integrated for secure payment processing.

## 2. Technology Stack

### Client-Side
*   **Framework:** React Native (Expo SDK 54)
*   **Language:** TypeScript
*   **Routing:** Expo Router
*   **Styling:** NativeWind (Tailwind CSS for React Native)
*   **State Management:** React Hooks and Context API
*   **Animations:** React Native Reanimated, Lottie

### Server-Side & Infrastructure
*   **Backend as a Service:** Supabase
*   **Database:** PostgreSQL (hosted on Supabase)
*   **Authentication:** Supabase Auth
*   **Real-time Updates:** Supabase Realtime
*   **Serverless Functions:** Supabase Edge Functions

### Integrations
*   **Payments:** Stripe (React Native SDK)
*   **Maps/Location:** (Implied usage for delivery addresses)

## 3. System Architecture

The application follows a modular architecture separating presentation logic, business logic, and data access layers.

### 3.1 Directory Structure

*   **/app**: Contains the application screens and routing logic based on Expo Router's file-based system.
*   **/components**: Reusable UI elements split into feature-specific folders (e.g., `ui`, `orders`).
*   **/hooks**: Custom React hooks encompassing business logic and data fetching (e.g., `useOrders`, `useCart`).
*   **/lib**: Configuration and initialization of external services (Supabase client, Stripe service).
*   **/types**: TypeScript interface definitions for data models (Order, User, Product).
*   **/supabase**: Database migrations, triggers, and edge function code.

### 3.2 Key Modules

#### A. Authentication Module
*   **Functionality:** Handles user registration, login, and session management.
*   **Files:** `app/SignIn.tsx`, `app/SignUp.tsx`, `hooks/useAuth.ts`.
*   **Mechanism:** Uses Supabase Auth with persisted sessions via AsyncStorage.

#### B. Order Management Module
*   **Functionality:** Allows users to place orders, view order history, and track active orders.
*   **Files:** `app/(tabs)/orders.tsx`, `hooks/useOrders.ts`, `types/order.ts`.
*   **Real-time Feature:** Listens for database `UPDATE` events to notify users when an order status changes (e.g., "Preparing", "Delivered") and displays an ETA.

#### C. Shopping Cart & Checkout
*   **Functionality:** Manages item selection, quantity adjustments, and final purchase.
*   **Files:** `app/checkout.tsx`, `hooks/useCart.ts`, `components/ui/CartModal.tsx`.
*   **Process:** Validates cart items, calculates totals (subtotal, delivery fees), and initiates payment intents.

#### D. Payment System
*   **Functionality:** Securely processes credit card transactions.
*   **Files:** `lib/paymentService.ts`, `lib/stripe.ts`, `app/PaymentMethods.tsx`.
*   **Integration:** Uses Stripe Payment Intents. Supports saving payment methods for future use via Edge Functions.

## 4. Data Models

### Order Entity
Represents a customer's purchase. Key fields include:
*   `id`: Unique identifier (UUID).
*   `user_id`: Reference to the customer.
*   `status`: Current state (pending, preparing, out_for_delivery, delivered, cancelled).
*   `payment_status`: Financial state (pending, paid, failed).
*   `total`: Final transactional amount.
*   `pickup_code`: Secure code for order verification (auto-generated via database trigger).
*   `eta`: Estimated time of arrival (timestamp).

### Order Item Entity
Represents individual items within an order.
*   `menu_item_id`: Reference to the product.
*   `quantity`: Number of units.
*   `options`: JSON object storing customizations (sides, toppings).

## 5. Security & Performance

*   **Row Level Security (RLS):** Database ensures users can only access their own data (orders, profiles).
*   **Environment Variables:** Sensitive keys (API keys) are managed via `.env` files and not hardcoded.
*   **Edge Functions:** Sensitive logic (such as attaching Stripe payment methods to customers) runs server-side to prevent client-side manipulation.

## 6. Setup & Deployment

### Prerequisites
*   Node.js (LTS version)
*   Expo CLI

### Installation
1.  Clone the repository.
2.  Run `npm install` to install dependencies.
3.  Configure `.env` with Supabase and Stripe credentials.
4.  Run `npx expo start` to launch the development server.
5.  Run `npx expo start --clear --tunnel` if there are network problems

### Database Setup
Execute the SQL migrations found in `/supabase` to set up tables, RLS policies, and triggers (e.g., `approval_trigger.sql`).
