# Yacht Booking Admin Dashboard

A professional, sea-themed admin dashboard for managing yacht bookings, built with Next.js, Tailwind CSS, and Supabase.

## Features

###  Dashboard Overview
- **Total Yachts** - Fleet management overview
- **Booked Yachts** - Currently reserved yachts
- **New Enquiries** - Customer inquiries requiring attention
- **User Feedback** - Customer reviews and ratings

### 🛥️ Yacht Management
- **Add New Yachts** - Comprehensive yacht registration form
- **Form Fields**:
  - Basic Info: Name, Type, Price, Rating, Reviews, Location, Guests, Length
  - Amenities: Multiple selection from predefined list
  - Unavailable Dates: Date picker for blocked periods
  - Media: Up to 8 images and 2 videos
  - Description: Detailed yacht information

### 📅 Booking Management
- **View All Bookings** - Complete booking overview
- **Status Management** - Approve, reject, or cancel bookings
- **Customer Information** - Contact details and preferences
- **Filter Options** - By status (pending, confirmed, cancelled)

### 💬 Customer Communication
- **Enquiries Management** - Handle customer inquiries
- **Feedback System** - Manage customer reviews and ratings
- **Reply System** - Respond to customers directly
- **Status Tracking** - Track communication status

## Database Schema

### Yachts Table
```sql
CREATE TABLE yachts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0.00,
  reviews INTEGER DEFAULT 0,
  location VARCHAR(255) NOT NULL,
  guests INTEGER NOT NULL,
  length DECIMAL(8,2) NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  unavailable_dates DATE[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Supporting Tables
- **bookings** - Customer reservations
- **enquiries** - Customer inquiries
- **feedback** - Customer reviews and ratings

## Setup Instructions

### 1. Database Setup
Run the SQL schema in your Supabase SQL editor:
```bash
# Execute the contents of sql/yachts_schema.sql in Supabase
```

### 2. Environment Variables
Ensure your `.env.local` file contains:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Component Structure
```
components/admin/
├── cards/
│   ├── index.tsx                 # Dashboard cards container
│   ├── total-yachts-card.tsx    # Total yachts overview
│   ├── booked-yachts-card.tsx   # Booked yachts overview
│   ├── new-enquiries-card.tsx    # New enquiries overview
│   └── user-feedback-card.tsx   # User feedback overview
├── yacht-form.tsx               # Yacht management form
├── bookings-management.tsx      # Booking management interface
├── feedback-management.tsx      # Customer feedback management
└── enquiries-management.tsx     # Customer enquiries management
```

## Usage

### Accessing the Dashboard
Navigate to `/admin` in your application to access the admin dashboard.

### Adding a New Yacht
1. Go to the "Yachts" tab
2. Click "Add New Yacht"
3. Fill in the comprehensive form
4. Submit to add to your fleet

### Managing Bookings
1. Go to the "Bookings" tab
2. View all customer reservations
3. Use filters to find specific bookings
4. Approve, reject, or update booking status

### Handling Enquiries
1. Go to the "Enquiries" tab
2. View customer inquiries
3. Reply directly to customers
4. Update enquiry status

### Managing Feedback
1. Go to the "Feedback" tab
2. View customer reviews and ratings
3. Reply to customer feedback
4. Track average ratings

## Design Features

### 🎨 Sea Theme
- **Color Palette**: Blues, cyans, and teals
- **Gradients**: Ocean-inspired backgrounds
- **Icons**: Maritime and nautical elements
- **Typography**: Clean, professional fonts

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Grid Layouts**: Adaptive column structures
- **Touch-Friendly**: Large buttons and touch targets

### ⚡ Performance
- **Lazy Loading**: Components load as needed
- **Optimized Queries**: Efficient database operations
- **Caching**: Smart data caching strategies

## Technical Stack

- **Framework**: Next.js 15.5.6
- **Styling**: Tailwind CSS 4.1.9
- **Database**: Supabase
- **UI Components**: Radix UI + Custom Components
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Sample Data

The SQL schema includes 5 sample yachts:
1. **Ocean Dream** - Motor Yacht (Monaco Marina)
2. **Sea Breeze** - Sailing Yacht (Cannes Port)
3. **Royal Wave** - Catamaran (St. Tropez Harbor)
4. **Marina Star** - Motor Yacht (Nice Port)
5. **Azure Explorer** - Sailing Yacht (Antibes Marina)

## Security Considerations

- **Authentication**: Integrated with Supabase Auth
- **Authorization**: Admin-only access controls
- **Data Validation**: Form validation and sanitization
- **SQL Injection**: Parameterized queries

## Future Enhancements

- **Analytics Dashboard**: Revenue and booking analytics
- **Email Integration**: Automated customer communications
- **Calendar Integration**: Visual booking calendar
- **Advanced Filtering**: More sophisticated search options
- **Bulk Operations**: Mass booking management
- **Export Features**: Data export capabilities

## Support

For technical support or feature requests, please refer to the main project documentation or contact the development team.
