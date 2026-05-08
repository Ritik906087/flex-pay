# **App Name**: FlexPay

## Core Features:

- User Authentication & Registration: Secure user registration and login using mobile number and password, with support for optional invite codes. Integrated with Firebase Authentication for backend.
- Personal Dashboard & Wallet Management: A dynamic dashboard displaying key financial metrics such as today's income, total balance, and transaction summaries. Provides quick action buttons for buying, selling, recharging, and withdrawing funds. Uses Firebase for data storage.
- Order Placement System: Browse and purchase available orders with a detailed view of order amount, profit percentage, and status. Automatically applies commission and bonus upon successful purchase. Uses Firebase to store order details and manage user balances.
- Transaction & Order History: View comprehensive history of all purchases, categorized by completed and pending orders, offering transparency in user's financial activities. Data fetched from Firebase.
- Referral Program & Sharing: Users can view their unique invite code, copy an invite link, and access basic referral statistics. Animated share buttons are included to encourage sharing.
- User Profile & Settings: Personalized user profile showing avatar, mobile number, auto-generated UID, wallet balance, and VIP level. Provides access to various settings and support options.
- Fixed Mobile App UI Experience: The application maintains a centered, fixed-width mobile app container on all devices, mimicking an Android native app. Browser zoom is disabled, and responsive design is applied while preserving the mobile app dimensions and feel.

## Style Guidelines:

- Background: A deep navy (#020617) sets the dark, premium fintech theme.
- Primary: A very dark blue (#0F172A) for significant UI components and deep typography.
- Secondary: A distinct dark blue (#1E3A8A) to add depth to various UI elements.
- Accent: A vibrant gradient cyan (#06B6D4) for interactive elements, highlights, and calls to action.
- Success: A clean green (#10B981) for positive feedback and confirmations.
- Card Elements: Translucent white (rgba(255,255,255,0.05)) for a sophisticated glassmorphism effect on cards.
- The font 'Inter' (sans-serif) will be used consistently for both headlines and body text, providing a clean, modern, and professional aesthetic fitting for a fintech application.
- The Lucide icon library will be utilized for all icons, ensuring a consistent, clear, and modern visual language across the application, suitable for professional fintech interfaces.
- The UI will adhere strictly to a mobile-first, fixed-width, centered layout with rounded corners to simulate a native Android application. A sticky bottom navigation bar will ensure primary app sections are always accessible.
- Implement smooth Android-like transitions between pages and loading states (skeletons), subtle ripple click effects on interactive elements, and focused animations for inputs, buttons, wallet updates, and purchase success feedback. Glassmorphism effects will be integrated into card designs.