# OmniCRM - Omnichannel Customer Relationship Management System

A comprehensive CRM platform built with Next.js, designed to manage customer relationships across multiple communication channels including WhatsApp, Facebook, Instagram, and more.

## 🚀 Features

### Core Functionality
- **Customer Management** - Complete customer profiles with contact details, tags, and communication history
- **Multi-Channel Messaging** - Unified inbox for WhatsApp, Facebook, Instagram, TikTok communications
- **Task Management** - Kanban and table views for task tracking with priorities and assignments
- **User Management** - Role-based access control for admins, agents, and users
- **Real-time Communication** - WebSocket-based live messaging and notifications
- **Analytics Dashboard** - Insights and metrics for business operations

### Key Features
- Lead to customer conversion
- Agent assignment and routing
- Message archiving and search
- AI-powered response suggestions
- Notes and activity tracking
- Customer tagging and segmentation
- Export functionality (CSV, Excel)
- Mobile responsive design

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript/React
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Real-time:** WebSockets
- **HTTP Client:** Axios
- **Notifications:** React Toastify
- **Icons:** Lucide React

## 📋 Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun package manager
- Access to backend API endpoint

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tech4mation/omnicrm-frontend.git
   cd omnicrm-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=your_api_url_here
   NEXT_PUBLIC_WS_URL=your_websocket_url_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌍 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes |
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL | Yes |

## 📁 Project Structure

```
omnicrm-frontend/
├── app/                          # Next.js app directory
│   ├── components/               # Reusable React components
│   │   ├── Customer/            # Customer-related components
│   │   ├── Messages/            # Messaging interface
│   │   ├── Task/                # Task management
│   │   └── Users/               # User management
│   ├── nativecrm/               # Main CRM routes
│   │   ├── customers/           # Customer pages
│   │   ├── messages/            # Messages pages
│   │   ├── tasks/               # Task pages
│   │   └── users/               # User pages
│   └── auth/                    # Authentication pages
├── context/                     # React Context providers
│   ├── AuthContext.js          # Authentication state
│   ├── ErrorContext.js         # Error handling
│   ├── PermissionsContext.js   # Role-based permissions
│   └── NotificationContext.js  # Notifications
├── services/                    # API services and configs
├── utils/                       # Utility functions
└── public/                      # Static assets
```

## 🚀 Deployment

This project supports multiple deployment environments:

### Environments
- **Development:** localhost:3000
- **Staging:** Auto-deploys from `dev` branch
- **Production:** Auto-deploys from `main` branch
- **Preview:** For experimental feature reviews

### Building for Production

```bash
npm run build
npm start
```

The build generates an optimized production bundle in the `.next` folder.

## 🔐 Authentication & Permissions

The system uses JWT-based authentication with role-based access control:

- **Admin** - Full system access
- **Agent** - Customer and task management
- **User** - Limited access based on permissions

Permissions are managed through the `PermissionsContext` and include:
- View/Add/Edit/Delete Users
- View/Add/Edit/Delete Customers
- View/Add/Edit/Delete Tasks
- Message Management

## 🧪 Development Workflow

1. Create a feature branch from `dev`
2. Make your changes
3. Test locally
4. Create a pull request to `dev` for staging
5. After approval, merge to `main` for production

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Bug Reports

If you encounter any bugs, please create an issue on GitHub with:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)
- Environment details

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Team

Developed and maintained by Tech4mation

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

Built with ❤️ using Next.js