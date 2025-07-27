# SIMORGH SERVICE Frontend

A modern, responsive React.js frontend for the SIMORGH SERVICE AI-powered cleaning marketplace. Built with Vite, Tailwind CSS, and designed for three distinct user roles: Customer, Cleaner, and Admin.

## 🚀 Features

### Core Features
- **Multi-Role Authentication**: Separate dashboards for Customers, Cleaners, and Admins
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Dynamic data fetching and state management
- **Stripe Integration**: Secure payment processing with Stripe Checkout
- **Modern UI Components**: Reusable components with consistent design
- **Route Protection**: Role-based access control
- **Fast Development**: Powered by Vite for lightning-fast builds

### Customer Features
- Browse and book cleaning services
- Schedule appointments with preferred time slots
- Secure payment processing via Stripe
- Track booking status and history
- Manage profile and preferences
- Leave reviews and ratings

### Cleaner Features
- View and manage assigned jobs
- Accept or reject booking requests
- Update availability calendar
- Track earnings and payment history
- Manage cleaner profile and services

### Admin Features
- User management (customers and cleaners)
- Booking oversight and management
- Service catalog management
- Analytics and reporting dashboard
- Payment and revenue tracking

## 🛠️ Tech Stack

- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS 4.1
- **Routing**: React Router DOM 7.6
- **HTTP Client**: Axios
- **Payment Processing**: Stripe React.js SDK
- **Icons**: Heroicons
- **Build Tool**: Vite 7.0
- **Development**: Fast refresh and hot module replacement

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd CleanMatch/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment setup**:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
   VITE_APP_NAME=SIMORGH SERVICE
   VITE_APP_URL=http://localhost:5173
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── layout/          # Layout components (Navbar, Layout, ProtectedRoute)
│   ├── payment/         # Stripe payment components
│   └── ui/              # Base UI components (Button, Card, Form, etc.)
├── contexts/            # React Context providers
│   └── AuthContext.jsx # Authentication context
├── hooks/               # Custom React hooks
│   └── useAuth.js      # Authentication hook
├── lib/                 # Utility libraries
│   ├── api.js          # API client configuration
│   ├── stripe.js       # Stripe configuration
│   └── utils.js        # Utility functions
├── pages/               # Page components
│   ├── auth/           # Authentication pages
│   ├── customer/       # Customer-specific pages
│   ├── cleaner/        # Cleaner-specific pages (to be added)
│   ├── admin/          # Admin-specific pages (to be added)
│   └── dashboard/      # Role-based dashboards
├── styles/             # Global styles
├── App.jsx             # Main application component
└── main.jsx           # Application entry point
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design System

### Color Palette
- **Primary**: Blue (Tailwind blue-600)
- **Success**: Green (Tailwind green-600)
- **Warning**: Yellow (Tailwind yellow-600)
- **Danger**: Red (Tailwind red-600)
- **Gray Scale**: Tailwind gray palette

### Components
All components follow a consistent design pattern:
- Responsive by default
- Accessible with proper ARIA labels
- Consistent spacing using Tailwind utilities
- Hover and focus states

## 🔐 Authentication Flow

1. **Registration**: Users select their role (customer/cleaner) during signup
2. **Login**: JWT-based authentication with automatic token refresh
3. **Role-based Routing**: Different dashboard views based on user role
4. **Protected Routes**: Automatic redirect to login for unauthenticated users

## 💳 Payment Integration

- **Stripe Elements**: Secure payment form components
- **Payment Intent**: Server-side payment processing
- **Mobile Optimized**: Responsive payment forms
- **Error Handling**: Comprehensive error messaging

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoints**: 
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
- **Navigation**: Collapsible mobile menu
- **Cards**: Responsive grid layouts

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Build for Production
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🔗 API Integration

The frontend communicates with the backend via REST APIs:

- **Authentication**: Login, register, password reset
- **User Management**: Profile updates, preferences
- **Bookings**: Create, view, update booking status
- **Payments**: Stripe integration for secure payments
- **Admin**: User management, analytics, system stats

## 🧪 Testing

Testing setup is ready for:
- Unit tests with Vitest
- Component testing with React Testing Library
- E2E testing with Playwright

## 📈 Performance

- **Vite**: Lightning-fast development and builds
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Dynamic imports for large components
- **Optimized Images**: Responsive image loading
- **Bundle Analysis**: Built-in bundle analyzer

## 🔧 Configuration

### Tailwind CSS
Configured for:
- Custom color palette
- Responsive design utilities
- Component classes
- Dark mode support (ready)

### Vite
Optimized for:
- Fast refresh
- Hot module replacement
- Build optimization
- Environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

---

Built with ❤️ using React, Vite, and Tailwind CSS+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
