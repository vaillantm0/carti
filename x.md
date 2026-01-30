# Frontend Architecture Analysis

This document provides an analysis of the frontend codebase, detailing its structure, data management, and interaction with backend services.

## 1. Project Structure Overview

The `src` directory is organized by feature and responsibility, promoting a clean and scalable architecture.

- **`components/`**: Contains reusable UI components.
- **`context/`**: Manages global application state using React's Context API.
- **`data/`**: Holds static mock data used for development and testing.
- **`hooks/`**: Defines custom React hooks for fetching and managing data.
- **`models/`**: Contains TypeScript interfaces defining the core data structures.
- **`pages/`**: Represents the different pages or views of the application.
- **`services/`**: Handles all API communication with the backend.
- **`types/`**: Defines miscellaneous TypeScript types used across the application.

## 2. Data Flow

The application follows a modern data flow pattern using `React Query` for server state management and `React Context` for global UI state.

1.  **API Services (`src/services`)**: These modules are responsible for making HTTP requests to the backend. They use an `axios` instance configured in `api.ts`.
2.  **Custom Hooks (`src/hooks`)**: These hooks abstract the data fetching logic using `React Query`. They call the service functions and provide a simple API to the components (e.g., `useProducts`, `useCartQuery`). This handles caching, refetching, and loading/error states.
3.  **Components (`src/pages`, `src/components`)**: UI components use the custom hooks to fetch data and render it. Mutations (Create, Update, Delete) are also handled via hooks provided by `React Query`.
4.  **Global State (`src/context`)**: UI state that needs to be shared globally, like authentication status or shopping cart visibility, is managed through React Context (e.g., `AuthContext`, `CartContext`).

## 3. Backend Connection & Mocking

The application is designed to work with a real backend but includes a robust mocking layer for development and testing.

- **API Client**: `src/services/api.ts` configures a global `axios` instance. It sets the base URL from the `VITE_API_URL` environment variable and automatically injects the authentication token from `localStorage` into the headers of outgoing requests.
- **Mocking Strategy**: Each service file (e.g., `src/services/products.ts`, `src/services/auth.ts`) contains a `USE_MOCK` flag controlled by the `VITE_USE_MOCK` environment variable.
  - If `VITE_USE_MOCK` is not set to `"false"`, the service functions will return mock data instead of making actual API calls.
  - This allows the frontend to be developed and tested independently of the backend.

## 4. Directory Details

### `src/models`

This directory defines the shape of the core data entities used throughout the application. These interfaces ensure type safety when interacting with the API and managing state.

- **`auth.ts`**: Defines payloads for login/register and the shape of the authentication response.
- **`cart.ts`**: Defines the structure of cart items and API payloads for cart operations.
- **`category.ts`**: Defines the `Category` interface.
- **`order.ts`**: Defines the structure of orders and their items.
- **`product.ts`**: Defines the `Product` interface.
- **`user.ts`**: Defines the `User` and `Role` types.

### `src/types`

This directory contains miscellaneous and component-specific type definitions that are not core to the data model.

- **`index.ts`**: Currently defines types that seem to be a mix of component-specific data shapes (`CategoryDataMap`) and duplicates of model definitions (`Product`, `CartItem`). This could potentially be refactored to rely more on the central `models`.

### `src/services`

This layer is the bridge between the frontend and the backend API. Each file corresponds to a specific API resource.

- **`api.ts`**: The central `axios` instance, configured with the base URL and an interceptor to add the auth token.
- **`auth.ts`**: Handles login, registration, and fetching user data. Includes mock logic.
- **`cart.ts`**: Manages all shopping cart operations (get, add, update, remove). Includes mock logic.
- **`categories.ts`**: Manages CRUD operations for categories. Includes mock logic and loads initial data from `src/data/categories.ts`.
- **`orders.ts`**: Manages creating and retrieving orders. Includes mock logic.
- **`products.ts`**: Manages CRUD operations for products. Includes mock logic and loads initial data from `src/data/products.ts`.

### `src/context`

Manages global state that is shared across many components.

- **`AuthContext.tsx`**: Provides the current user and authentication token, along with `login` and `logout` functions. It persists the auth state to `localStorage`.
- **`CartContext.tsx`**: Manages the local state of the shopping cart UI, including whether the cart sidebar is open and the items currently in the cart (for display purposes before API sync). *Note: This seems to be a local, client-side cart implementation, separate from the server-side cart managed by `useCartApi`.*

### `src/hooks`

These custom hooks provide a clean, reusable interface for components to interact with the backend data. They are built on top of `React Query`.

- **`useAuth.ts`**: Provides `useLogin` and `useRegister` mutations.
- **`useCartApi.ts`**: Provides hooks for all cart operations (`useCartQuery`, `useAddToCart`, etc.).
- **`useCategories.ts`**: Provides hooks for category CRUD operations.
- **`useOrders.ts`**: Provides hooks for creating and fetching orders.
- **`useProducts.ts`**: Provides hooks for fetching products (all, by ID, by category) and performing CRUD operations.

### `src/data`

This directory contains static, hard-coded data used to populate the mock services.

- **`categories.ts`**: An array of `Category` objects.
- **`categoryData.ts`**: A map of category-specific data, likely for static pages.
- **`products.ts`**: An array of `Product` objects.
- **`shopData.ts`**: A comprehensive object containing products grouped by category, likely for specific shop pages.

## 5. How Mock Data is Loaded

The mocking system is primarily driven by the `USE_MOCK` flag in the `src/services` files.

1.  **Environment Variable**: The `VITE_USE_MOCK` environment variable controls whether the application uses mock data. If it's anything other than `"false"`, mock data is used.
2.  **Service Logic**: Inside each service (e.g., `products.ts`), the functions check the `USE_MOCK` flag at the beginning.
3.  **Data Source**:
    - If `USE_MOCK` is `true`, the function interacts with an in-memory variable (e.g., `mockProducts` in `products.ts`).
    - This in-memory variable is often initialized directly from a file in the `src/data` directory. For example, `src/services/categories.ts` imports `dataCategories` from `src/data/categories.ts` to initialize its local `mockCategories` array.
    - The service function then returns this mock data, simulating a successful API call.
4.  **No API Call**: If `USE_MOCK` is `true`, the `axios` API call is never made.

This setup allows the frontend to be fully functional for development and UI testing without requiring a running backend.
