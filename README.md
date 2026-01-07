# Inventory Management Dashboard

A full-stack server-rendered admin dashboard built with Next.js, designed to manage products, track inventory values, and visualize data in real-time.

## 🚀 Features

* **Secure Authentication:** Admin login protected by NextAuth (Credentials).
* **Product Management (CRUD):** Create, Read, Update, and Delete inventory items.
* **Image Upload:** Integration with Cloudinary for product images.
* **Data Visualization:** Interactive charts showing inventory distribution.
* **Search & Filter:** Real-time search functionality for the product catalog.
* **Responsive Design:** Fully responsive UI built with Tailwind CSS.

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router)
* **Database:** MongoDB & Mongoose
* **Authentication:** NextAuth.js
* **Styling:** Tailwind CSS
* **Charts:** Recharts / Chart.js
* **Icons:** Lucide React

## ⚙️ Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/prachigupta6/inventory-dashboard-final.git](https://github.com/prachigupta6/inventory-dashboard-final.git)
    cd inventory-dashboard-final
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and add:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    NEXTAUTH_SECRET=your_secret_key
    NEXTAUTH_URL=http://localhost:3000
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
    NEXT_PUBLIC_CLOUDINARY_PRESET=your_upload_preset
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

## 🌐 Live Demo
[Insert your Vercel Link Here]