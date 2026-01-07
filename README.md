# E-commerce Administrative Inventory Dashboard

A comprehensive eCommerce software solution for managing inventory and visualizing data using server-side rendered (SSR) web technology. Administrators have an easy-to-use, secure interface to work with when updating stock quantities, monitoring levels and tracking sales using real-time data.

## Project Overview

The eCommerce administrative back-end is built with Next.js so all data is pulled and static pages are created on the server, providing optimal user experience, performance, SEO, reliability, and faster initial load times. Included in this eCommerce system are secure user authentication, real-time database management, and cloud storage options for product/asset images.

## Key Features

* **Server-Side Rendering (SSR):** The ability to pull product data and render pages on the fly; hence the term 'server-side rendering,' or SSR, using Next.js to serve product data and render pages for near-instant loads.
* **Inventory Management:** Users can perform CRUD operations (Create, Read, Update, Delete) against a product catalog.
* **Advanced Form Validation:** Validation of forms created using Zod is achievable using validation rules (hooks) at the time of saving products or updating quantities.
* **Data Visualization:** Recharts has been utilized to provide you with rich visual analytics regarding sales trends, stock distribution, and revenue through interactive dashboards.
* **Cloud Media Management:** The ability to upload product images directly to Cloudinary for secure image storage. 
* **Secure Authentication:** Access to Admin is secured using NextAuth.js; a session-based authentication system allows authenticated administrators to control their login sessions, manage access, and logout securely.
* **Admin Onboarding:** A restricted administrative feature allowing for the creation of new admin accounts, accessible only to authenticated users.

## Tech Stack

* **Framework:** Next.js (App Router)
* **Database:** MongoDB with Mongoose ODM
* **Authentication:** NextAuth.js
* **Validation:** Zod
* **Visualization:** Recharts
* **Storage:** Cloudinary
* **Styling:** Tailwind CSS

## System Workflow

1. **Request:** The administrator initiates a request for the dashboard or product pages.
2. **Server Fetch:** The server establishes a connection with MongoDB and fetches the required product and activity data.
3. **Pre-rendering:** The application renders the HTML on the server, injecting the fresh data before transmission.
4. **Interaction:** The administrator manages products through Zod-validated forms and interacts with dynamic charts.
5. **Data Persistence:** Mutations (Create/Update/Delete) are processed through API routes and saved to the database.
6. **State Refresh:** Upon successful data modification, the UI utilizes router refreshing to synchronize the server-rendered data with the client view.

## Environment Configuration

To run this project locally, create a .env file in the root directory with the following variables:

```env
MONGODB_URI=mongodb+srv://admin:cdc123@cluster0.kugvh7y.mongodb.net/dashboardDB?appName=Cluster0
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="mysupersecretpassword123"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dva3r9you
NEXT_PUBLIC_CLOUDINARY_PRESET=ml_default

## Admin Access (Dummy Credentials)
To access the admin dashboard and manage products, please use the following credentials:

- **Email:** dummy@gmail.com
- **Password:** password123
