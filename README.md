# AIPAS - AI-Powered Procurement Automation System

## 📋 Overview

AIPAS (AI-Powered Procurement Automation System) is a full-stack web application designed to streamline and automate procurement processes. It connects buyers and vendors through a unified platform, enabling digital procurement request management, automated quotation comparison, and intelligent document processing.

## 🏗️ Architecture

```
AIPAS/
├── backend/                  # FastAPI Backend (Python)
│   ├── app/
│   │   ├── main.py           # Application entry point
│   │   ├── config.py         # Configuration settings
│   │   ├── database.py       # MongoDB connection & indexes
│   │   └── routes/
│   │       ├── auth.py       # Authentication endpoints
│   │       ├── buyer.py      # Buyer operations
│   │       ├── vendor.py     # Vendor operations
│   │       ├── admin.py      # Admin management
│   │       └── chat.py       # AI Chatbot integration
│   ├── .env                  # Environment variables
│   ├── requirements.txt      # Python dependencies
│   └── create_admin.py       # Admin user setup script
│
├── frontend/                 # React Frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── App.jsx           # Main application component
│   │   ├── main.jsx          # Entry point
│   │   ├── components/
│   │   │   ├── admin/        # Admin dashboard components
│   │   │   ├── buyer/        # Buyer dashboard components
│   │   │   ├── vendor/       # Vendor dashboard components
│   │   │   ├── common/       # Shared components (Navbar, Sidebar, etc.)
│   │   │   ├── landing/      # Landing page components
│   │   │   └── ChatBot.jsx   # AI Chatbot component
│   │   ├── pages/            # Page-level components
│   │   ├── services/
│   │   │   └── api.js        # API service layer (Axios)
│   │   ├── context/          # React context providers
│   │   ├── styles/           # Custom CSS & animations
│   │   └── utils/            # Utility functions
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
```

## 🛠️ Tech Stack

### Backend
- **Framework:** FastAPI (Python 3.9+)
- **Database:** MongoDB 7.0 with Motor (async driver)
- **Authentication:** JWT (python-jose) + bcrypt password hashing
- **File Processing:** pdfplumber, pytesseract, pdf2image, Pillow
- **Document AI:** Google Cloud Vision, Google Cloud Document AI
- **Excel Export:** openpyxl
- **Server:** Uvicorn (ASGI)

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS with custom animations
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Routing:** React Router DOM

### Infrastructure
- **OS:** AlmaLinux 9.6
- **Web Server:** Nginx (reverse proxy)
- **Process Manager:** Uvicorn (nohup)
- **SSL:** Certbot (Let's Encrypt)

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with role-based access control
- Three user roles: Admin, Buyer, Vendor
- User verification system managed by Admin
- Secure password hashing with bcrypt

### 👤 Admin Dashboard
- User management (verify, unverify, delete users)
- System-wide statistics and analytics
- Recent activity monitoring

### 🛒 Buyer Dashboard
- Create procurement requests with detailed specifications
- View and manage all procurement requests
- Receive and compare vendor quotations
- **AI-Powered Quotation Comparison** — automated PDF extraction and side-by-side comparison
- **Quick Compare** — upload and compare quotation PDFs from any source
- Export comparisons to Excel (.xlsx)
- Combined export (vendor quotations + uploaded PDFs)

### 🏪 Vendor Dashboard
- Browse open procurement requests
- Submit quotations as PDF documents
- Track quotation status and history
- View quotation details

### 🤖 AI Features
- **Document Processing:** OCR-based PDF text extraction using pytesseract
- **Intelligent Parsing:** Automated extraction of pricing, terms, and specifications from quotation PDFs
- **Google Cloud Vision & Document AI** integration for advanced document analysis
- **AI Chatbot** for user assistance

### 📱 Responsive Design
- Fully responsive across desktop, tablet, and mobile
- Collapsible sidebar navigation
- Mobile-optimized dashboard layouts

## 🚀 Deployment Guide

### Prerequisites
- AlmaLinux 9 / RHEL 9 / CentOS 9 (or similar)
- Node.js 20.x
- Python 3.9+
- MongoDB 7.0
- Nginx

### 1. Clone / Upload Project
```bash
# Upload and extract project to server
unzip AIPAS.zip -d /var/www/aipas
```

### 2. Backend Setup
```bash
cd /var/www/aipas/backend

# Install Python dependencies
pip3 install -r requirements.txt

# Configure environment
nano .env
```

**.env Configuration:**
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=procurement_portal
SECRET_KEY=your-secure-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

```bash
# Create admin user
python3 create_admin.py

# Start backend server (port 8001)
nohup uvicorn app.main:app --host 0.0.0.0 --port 8001 &
```

### 3. Frontend Setup
```bash
cd /var/www/aipas/frontend

# Install dependencies
npm install

# Build for production
npm run build
```

### 4. Nginx Configuration
```nginx
server {
    listen 80;
    server_name aipas.duckdns.org;

    root /var/www/aipas/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 10M;
    }
}
```

```bash
nginx -t && systemctl restart nginx
```

### 5. SSL Setup (HTTPS)
```bash
yum install certbot python3-certbot-nginx -y
certbot --nginx -d aipas.duckdns.org
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login (returns JWT) |
| GET | `/auth/me` | Get current user profile |

### Buyer
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/buyer/requests` | Create procurement request |
| GET | `/buyer/requests` | List my requests |
| GET | `/buyer/requests/{id}` | Request details |
| GET | `/buyer/requests/{id}/quotations` | Get quotations for request |
| POST | `/buyer/requests/{id}/quotations/{qid}/accept` | Accept a quotation |
| GET | `/buyer/requests/{id}/comparison` | Compare quotations |
| GET | `/buyer/requests/{id}/export-excel` | Export to Excel |
| POST | `/buyer/quick-compare` | Quick compare uploaded PDFs |
| POST | `/buyer/quick-compare/export-excel` | Export quick compare to Excel |
| POST | `/buyer/requests/{id}/export-combined-excel` | Combined export |

### Vendor
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/vendor/requests` | Browse open requests |
| POST | `/vendor/quotations/submit` | Submit quotation (PDF) |
| GET | `/vendor/quotations` | List my quotations |
| GET | `/vendor/quotations/{id}` | Quotation details |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | List all users |
| POST | `/admin/users/{id}/verify` | Verify user |
| POST | `/admin/users/{id}/unverify` | Unverify user |
| DELETE | `/admin/users/{id}` | Delete user |
| GET | `/admin/stats` | System statistics |
| GET | `/admin/recent-activity` | Recent activity log |

## 🔧 Common Commands

```bash
# Restart backend
fuser -k 8001/tcp && sleep 1
cd /var/www/aipas/backend
nohup uvicorn app.main:app --host 0.0.0.0 --port 8001 &

# Rebuild frontend after changes
cd /var/www/aipas/frontend
npm run build

# Check backend logs
tail -50 /var/www/aipas/backend/nohup.out

# Check backend health
curl http://localhost:8001/health

# Edit backend files
nano /var/www/aipas/backend/app/routes/auth.py
nano /var/www/aipas/backend/.env

# Edit frontend files
nano /var/www/aipas/frontend/src/services/api.js
```

## 👤 Default Admin Credentials

| Field | Value |
|-------|-------|
| Email | admin@procurement.com |
| Password | admin123 |

> ⚠️ **Change the default password after first login!**

## 📄 License

Proprietary — All rights reserved.