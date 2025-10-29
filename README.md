# Cafe Manager System

A comprehensive full-stack cafe management system with separate interfaces for staff/admin and customers. Built with modern web technologies and powered by Lovable Cloud for backend services.

## 📋 Project Overview

Cafe Manager is a complete restaurant management solution that enables cafe owners to manage their operations efficiently while providing customers with a seamless ordering and booking experience. The system features real-time updates, secure authentication, and an intuitive interface for both staff and customers.

## ✨ Features

### Admin/Staff Features
- **Dashboard**: Overview of cafe operations and key metrics
- **Order Management**: View, update, and track customer orders in real-time
- **Menu Management**: Add, edit, and manage menu items with categories, prices, and availability
- **Table Management**: Manage table reservations and availability status
- **Secure Authentication**: Role-based access control with admin privileges

### Customer Features
- **Browse Menu**: View available menu items organized by categories
- **Shopping Cart**: Add items to cart with local storage persistence
- **Order Placement**: Place orders with real-time status updates
- **Table Booking**: Reserve tables and check availability
- **Order History**: Track current and past orders
- **Responsive Design**: Optimized for mobile and desktop devices

## 🛠️ Technologies Used

### Frontend
- **React 18.3.1** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Reusable component library
- **React Router DOM** - Client-side routing
- **TanStack Query** - Data fetching and caching

### Backend (Lovable Cloud)
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication & Authorization

### UI Components & Libraries
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **React Hook Form** - Form validation
- **Sonner** - Toast notifications
- **Recharts** - Data visualization

## 📦 Requirements

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🚀 Getting Started

### Installation

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**

The project uses Lovable Cloud, so environment variables are automatically configured. The `.env` file contains:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon/public key
- `VITE_SUPABASE_PROJECT_ID` - Supabase project identifier

### Running the Application

**Development Mode**
```bash
npm run dev
```
The application will start on `http://localhost:8080`

**Build for Production**
```bash
npm run build
```

**Preview Production Build**
```bash
npm run preview
```

## 👥 Default Admin Credentials

For initial access to the admin dashboard:

- **Email**: `cafemanager123@gmail.com`
- **Password**: `123456789`

⚠️ **Security Note**: Change these credentials in production environments.

## 📁 Project Structure

```
cafe-manager/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── AppSidebar.tsx  # Admin sidebar navigation
│   │   ├── Layout.tsx      # Admin layout wrapper
│   │   └── CustomerLayout.tsx # Customer layout wrapper
│   ├── pages/              # Route pages
│   │   ├── Landing.tsx     # Landing page
│   │   ├── Auth.tsx        # Authentication page
│   │   ├── Index.tsx       # Admin dashboard
│   │   ├── Orders.tsx      # Order management
│   │   ├── Menu.tsx        # Menu management
│   │   ├── Tables.tsx      # Table management
│   │   └── customer/       # Customer-facing pages
│   │       ├── CustomerHome.tsx
│   │       ├── CustomerMenu.tsx
│   │       ├── Cart.tsx
│   │       ├── BookTable.tsx
│   │       └── MyOrders.tsx
│   ├── integrations/       # Backend integrations
│   │   └── supabase/       # Supabase client & types
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles & design tokens
├── supabase/
│   ├── config.toml         # Supabase configuration
│   └── migrations/         # Database migrations
├── public/                 # Static assets
└── package.json            # Dependencies & scripts
```

## 🗄️ Database Schema

The application uses the following main tables:

### `profiles`
- User profile information
- Linked to auth.users

### `user_roles`
- Role-based access control
- Roles: admin, staff, customer
- Uses security definer functions to prevent RLS recursion

### `menu_items`
- Menu item details (name, description, price, category)
- Availability status
- Image URLs

### `cafe_tables`
- Table information (number, seats)
- Status tracking (available, occupied, reserved)

### `orders`
- Order details and status
- Customer information
- Total amount and order items
- Real-time status updates

## 🔐 Authentication & Authorization

The system implements secure authentication using Supabase Auth with:
- Email/password authentication
- Row Level Security (RLS) policies
- Role-based access control (RBAC)
- Secure session management
- Protected routes for admin and customer areas

### User Roles
- **Admin**: Full access to all management features
- **Customer**: Access to customer-facing features only

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- Server-side role validation using security definer functions
- Protected API routes
- Secure password hashing
- Token-based authentication
- Input validation and sanitization

## 🎨 Design System

The project uses a comprehensive design system with:
- Semantic color tokens (primary, secondary, accent, etc.)
- Consistent spacing and typography
- Dark/light mode support (configured via Tailwind)
- Responsive breakpoints
- Reusable component variants

All colors use HSL format defined in `src/index.css` and `tailwind.config.ts`.

## 🌐 Routes

### Public Routes
- `/` - Landing page
- `/auth` - Login/Signup page

### Admin Routes (Protected)
- `/dashboard` - Admin dashboard
- `/orders` - Order management
- `/menu` - Menu management
- `/tables` - Table management

### Customer Routes (Protected)
- `/customer` - Customer home
- `/customer/menu` - Browse menu
- `/customer/cart` - Shopping cart
- `/customer/book-table` - Book a table
- `/customer/my-orders` - Order history

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔄 Real-time Features

The application leverages Supabase real-time subscriptions for:
- Live order status updates
- Real-time table availability
- Instant menu updates

## 🚢 Deployment

The application can be deployed using Lovable's built-in deployment:

1. Click the **Publish** button in Lovable
2. Your app will be deployed to a Lovable subdomain
3. Optionally connect a custom domain in Project Settings

### Alternative Deployment Options
Since the code is standard React/Vite, you can also deploy to:
- Vercel
- Netlify
- AWS Amplify
- Any static hosting service

## 🤝 Contributing

This project was built with Lovable. To make changes:

1. **Use Lovable**: Visit the project in Lovable and use the AI to make changes
2. **Local Development**: Clone the repo, make changes, and push to GitHub
3. **GitHub Integration**: Changes sync automatically between Lovable and GitHub

## 📄 License

This project is created with Lovable and follows standard web application licensing.

## 🐛 Troubleshooting

### Common Issues

**Issue**: Can't log in as admin
- **Solution**: Use the default credentials provided above. Ensure email is confirmed.

**Issue**: Database connection errors
- **Solution**: Check that environment variables are correctly set in `.env`

**Issue**: Build fails
- **Solution**: Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

**Issue**: Real-time updates not working
- **Solution**: Check that RLS policies allow the current user to access the data

## 📞 Support

For issues or questions:
- Check the [Lovable Documentation](https://docs.lovable.dev/)
- Visit the [Lovable Discord Community](https://discord.com/channels/1119885301872070706/1280461670979993613)

## 🔗 Useful Links

- **Lovable Project**: https://lovable.dev/projects/fd5d0bcd-d771-4c03-9765-7046ad7264cd
- **Lovable Docs**: https://docs.lovable.dev/
- **Supabase Docs**: https://supabase.com/docs (for advanced backend customization)

---

**Built with ❤️ using Lovable**
