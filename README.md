# ShiftSwap - Frontend 🎨

<p align="start">
  <img src="https://github.com/Saurabh1590/shift-swap-backend/blob/main/src/assets/ShiftSwapLogo.png?raw=true" alt="ShiftSwap Logo" width="200"/>
</p>

This is the frontend for the ShiftSwap application, a modern and responsive user interface built with React and Vite. It provides a seamless experience for both employees and administrators to manage their schedules.

---

## ✨ Key Features

- **Modern UI/UX:** Clean, responsive, and intuitive design built with Tailwind CSS.
- **Role-Based Dashboards:** Separate, feature-rich dashboards for Employees and Administrators.
- **Interactive Calendar:** A dynamic calendar serves as the main hub for employees, showing their schedule with color-coded shift types, approved leaves, and completed swaps.
- **Intelligent Forms:** Smart forms for proposing swaps and requesting leave, with client-side validation that prevents scheduling conflicts and enforces business rules.
- **Full Request Lifecycle:** Complete user flows for proposing, viewing, accepting, and tracking the history of all shift swaps and leave requests.
- **Global State Management:** Uses React Context for robust authentication and session management across the application.

---

## 🛠️ Tech Stack

- **Framework:** React.js (with Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **API Communication:** Axios
- **Date Management:** date-fns

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- A running instance of the [ShiftSwap Backend](https://github.com/your-username/shift-swap-backend).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/shift-swap-frontend.git](https://github.com/your-username/shift-swap-frontend.git)
    cd shift-swap-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure API connection:**
    The API base URL is configured in `src/api/axios.js`. By default, it's set to connect to the backend at `http://localhost:5000/api`.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.