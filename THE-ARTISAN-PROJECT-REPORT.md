# THE ARTISAN MARKETPLACE
## FULL-STACK E-COMMERCE PLATFORM FOR ARTISAN PRODUCTS
### USIU-Africa Final Year Project Report Structure (35-50 pages + Appendix)

**Student:** [Your Name]  
**Reg No:** [Your Reg No]  
**Degree:** Bachelor of Science in Computer Science  
**Date:** April 2026  

---

## TABLE OF CONTENTS
[Auto-generate in Word]

## LIST OF TABLES
Table 1: ERD Models  
Table 2: API Endpoints  

## LIST OF FIGURES
Figure 1: Context Diagram  
Figure 2: Level 1 DFD  
Figure 3: Use Case Diagram  
Figure 4: System Architecture  
Figure 5: ERD  

---

## CHAPTER ONE: INTRODUCTION (2-3 pages)

### 1.1 Background of the Study
The Artisan Marketplace addresses the challenge faced by local artisans in Kenya - lack of digital visibility for handmade products. Traditional markets limit reach, while urban artisans struggle with online presence. This MERN stack platform connects artisans, admins, and customers.

Current operations: Manual sales, no inventory tracking, no admin approval workflow.

### 1.2 Problem Statement
1. Artisans lack platform to showcase/ sell approved products online.
2. Customers can't discover artisan-specific products by category.
3. No admin moderation for product quality.
4. No e-commerce features (cart, wishlist, orders).

### 1.3 Objectives
#### 1.3.1 General Objective
To develop a full-stack e-commerce platform for artisan product discovery and sales.

#### 1.3.2 Specific Objectives
i. **Designed** artisan dashboard for product upload/approval workflow.
ii. **Developed** category-based product discovery with artisan carousels.
iii. **Deployed** admin dashboard for moderation (approve products/artisans).
iv. **Analyzed** e-commerce features (cart, wishlist, orders, payments).

### 1.4 Research Questions
i. How to implement approval workflow for product quality?
ii. How to group products by artisan in category pages?
iii. What tech stack for scalable MERN e-commerce?

### 1.5 Significance
- Artisans: Digital marketplace, WhatsApp direct contact.
- Customers: Category browsing, artisan carousels.
- University: Full MERN implementation with role-based auth.

### 1.6 Scope & Limitation
**Scope:** Frontend (React/Vite/Tailwind), Backend (Node/Express/MongoDB), Auth (JWT), Payments (Mpesa-ready), Dashboards.
**Limitation:** No live payments, local MongoDB.

## CHAPTER TWO: LITERATURE REVIEW (3-5 pages)

### 2.1 E-commerce Platforms for Artisans
Etsy (2005): Category browsing, seller profiles. Gap: No admin approval.

### 2.2 Role-Based Authentication
JWT + MongoDB roles (admin/artisan/customer).

### 2.3 Product Approval Workflows
Admin moderation prevents spam (Amazon model).

### 2.3 Concept Map
```
[Independent: Artisan Upload] --> [Moderation] --> [Approved Products] --> [Category/Artisan Carousel]
```

## CHAPTER THREE: METHODOLOGY (4-5 pages)

### 3.1 Research Design
Agile development with MERN stack.

### 3.2 Data Collection
Code analysis, API testing (curl/Postman).

### 3.3 Design Diagrams

**Figure 1: Context Diagram**
```
Customer <--> Frontend <--> Backend <--> MongoDB
Admin/Artisan <--> Frontend
```

**Figure 2: Level 1 DFD**
```
1.0 Product Upload (Artisan)
2.0 Approve Product (Admin)
3.0 Browse Category (Customer)
4.0 Place Order
```

**Figure 3: Use Case Diagram**
```
Actor: Customer (Browse, Cart, Order)
Actor: Artisan (Upload, Dashboard)
Actor: Admin (Approve, Stats)
```

**Figure 4: ERD** (Appendix)
```
User (name, role, isApproved, phone) 1---* Product (title, price, image, category, artisanId, isApproved)
User 1---* Order
```

### 3.4 Research Ethics
User data encrypted, JWT auth, consent via terms/privacy pages.

## CHAPTER FOUR: SYSTEM IMPLEMENTATION & DEPLOYMENT (8-10 pages)

### 4.1 Introduction
MERN stack deployed locally. Features: Role dashboards, category carousels, approval workflow.

### 4.2 System Architecture
```
Frontend: React/Vite/Tailwind + Context API
Backend: Node/Express + MongoDB/Mongoose
API: REST v1 (auth, products, orders)
Dark mode, responsive.
```

**Figure 5: Architecture Diagram**
```
Browser → Vite Dev Server → React App → Axios → Express API → MongoDB
```

### 4.3 Frontend Development
React 18, Vite, Tailwind. Components: ProductCard, CategoryPage carousel.

**Code Extract (CategoryPage.jsx - Appendix A1)**
```jsx
// Carousel per artisan
const artisansMap = {};
products.forEach(p => {
  const artisanName = p.artisanId?.name;
  // ...
});
```

**Screenshots:** HomePage categories, CategoryPage carousel, ArtisanDashboard.

### 4.4 User Interface Design
Tailwind responsive, dark mode. Low-fi: Wireframes (screenshot).

### 4.5 UI Modules
- HomePage: NewArrivals, TopSellers, DiscoverCategories (dynamic from DB).
- CategoryPage: Artisan-grouped horizontal scroll carousel w/ WhatsApp.

### 4.6 Backend Development

#### 4.6.1 Database Design
**Mongoose Schemas (Appendix A2)**
- User: role (admin/artisan/customer), isApproved.
- Product: artisanId ref User, category, isApproved.
- Order: userId ref User.

#### 4.6.2 API Endpoints
```
GET /api/v1/products (approved)
GET /api/v1/products/category/:name (new!)
POST /api/v1/products (artisan upload)
PATCH /api/v1/products/approve/:id (admin)
```

#### 4.6.3 Code Testing
Postman collection: Auth, CRUD products. Unit tests pending.

### 4.7 Deployment
Local: `npm run dev` frontend, `npm start` backend. Future: Vercel + Railway.

### 4.8 Conclusion & Future Work
Implemented artisan e-commerce. Future: Live payments, mobile app, AI recommendations.

## REFERENCES (APA)
React.js. (2024). Meta Open Source. Retrieved from https://react.dev

Node.js. (2024). Joyent Inc. Retrieved from https://nodejs.org

MongoDB. (2024). MongoDB Inc. Retrieved from https://mongodb.com

Tailwind CSS. (2024). Tailwind Labs. Retrieved from https://tailwindcss.com

## APPENDICES (10-20 pages)

**Appendix A1: CategoryPage.jsx** (full 200 lines)
**Appendix A2: Product.js Model** (full)
**Appendix A3: ProductsRoutes.js** (full)
**Appendix A4: ERD Screenshot**
**Appendix A5: API Postman Collection JSON**
**Appendix A6: Screenshots (10+ pages)**
- Admin approve workflow
- Category carousel
- Artisan upload
- Cart checkout

---

**Copy to Word, add screenshots/diagrams (draw.io), expand sections, generate TOC.** Ready for submission! 🚀
