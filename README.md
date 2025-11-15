# Barangay Flood Alert - Real-time Emergency Monitoring System

A modern **Progressive Web Application (PWA)** designed to keep communities safe during flood events through real-time monitoring, emergency alerts, and bilingual safety resources.

## 🌊 Features

### Real-Time Flood Monitoring
- **Dynamic water level visualization** with animated 3D effects
- **Progressive alert system**: SAFE → CAUTION → DANGER → CRITICAL  
- **Status-responsive backgrounds** that transform based on flood severity
- **Glassmorphic ocean theme** with emergency-optimized UI

### Emergency Management
- **Instant emergency alerts** with full-screen critical overlays
- **One-tap emergency calling** with priority contact management
- **Progressive severity notifications** with visual and haptic feedback
- **Emergency contact directory** with real-time availability status

### Bilingual Support (English/Cebuano)
- **Seamless language switching** with smooth animations
- **Localized safety content** for better community understanding
- **Emergency phrases** in both languages for crisis communication

### Safety & Preparedness
- **Interactive safety tips** organized by flood phases (Before/During/After)
- **Emergency kit checklist** with priority indicators
- **Evacuation guidance** and nearest shelter information

## 🚀 Technology Stack

- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS with custom glassmorphic design system
- **UI Components**: shadcn/ui with emergency-optimized variants
- **Backend**: Supabase integration (required for real-time features)
- **PWA**: Service worker, offline capability, push notifications

## ⚡ Getting Started

### Prerequisites
- Node.js & npm installed
- **Supabase account** (required for backend functionality)

### Installation

1. **Clone and setup**
   ```bash
   git clone <YOUR_GIT_URL>
   cd barangay-flood-alert
   npm install
   npm run dev
   ```

2. **Connect Supabase** (Essential)
   - Click the **green Supabase button** in the top right of your Lovable interface
   - Follow the integration setup process
   - This enables real-time sensor data, user authentication, and emergency contact management

### Database Schema
Once Supabase is connected, the following tables will be created:
- `flood_data` - Real-time water level and status information
- `sensors` - ESP32 device management and readings
- `emergency_contacts` - Priority-organized emergency contacts
- `users` - User authentication and language preferences
- `safety_tips` - Bilingual safety content management

## 🛠️ ESP32 Sensor Integration

Connect water level sensors to automatically update flood status:

```cpp
// Sample ESP32 code for Supabase integration
void sendToSupabase(float waterLevel, String status) {
  HTTPClient http;
  http.begin("https://your-project.supabase.co/rest/v1/flood_data");
  http.addHeader("Authorization", "Bearer " + supabaseKey);
  
  DynamicJsonDocument doc(1024);
  doc["water_level_cm"] = waterLevel;
  doc["current_status"] = status;
  doc["last_updated"] = getTimestamp();
  
  String payload;
  serializeJson(doc, payload);
  http.PATCH(payload);
}
```

## 🎨 Design System

### Ocean Emergency Theme
- **Primary Colors**: Deep ocean blues (#0B1426, #1E3A8A)
- **Status Colors**: 
  - SAFE: Calm green (#10B981)
  - CAUTION: Warning amber (#F59E0B)  
  - DANGER: Alert orange (#F97316)
  - CRITICAL: Emergency red (#EF4444)

### Glassmorphic Effects
- **Backdrop blur**: 20px for depth perception
- **Gradient backgrounds**: Dynamic status-based transformations
- **Floating shadows**: Multi-layer depth with status-aware glows
- **Animated water**: CSS-powered wave effects and particle systems

## 📱 Progressive Web App Features

- **Offline functionality** for emergency situations
- **Push notifications** for critical flood alerts
- **Installable** on mobile devices
- **Touch-optimized** interface for all age groups
- **Responsive design** optimized for emergency scenarios

## 🔐 Security & Privacy

- **Row Level Security** (RLS) enabled on all Supabase tables
- **Role-based access** (users vs. administrators)
- **Secure authentication** with Supabase Auth
- **Emergency bypass** for critical flood situations

## 🌍 Deployment

### Quick Deploy with Lovable
1. Click **Publish** in the top right of the Lovable interface
2. Your app will be deployed automatically
3. Connect a custom domain in Project Settings > Domains

### Production Considerations
- Configure push notification credentials
- Set up ESP32 sensor network integration
- Train emergency responders on admin panel usage
- Test emergency protocols with community stakeholders

## 📞 Emergency Integration

This system is designed to complement, not replace, existing emergency services:

- **Primary**: Always call **911** for life-threatening emergencies
- **Secondary**: Use app-provided emergency contacts for local coordination
- **Tertiary**: Community notification and preparation assistance

## 🤝 Contributing

This project serves real communities during crisis situations. Contributions should prioritize:

1. **Emergency accessibility** - Works for all age groups and technical levels
2. **Reliability** - No false alarms or missed critical alerts  
3. **Performance** - Fast loading during high-stress situations
4. **Localization** - Community-appropriate language and cultural considerations

## 📄 License & Usage

Built for community safety and emergency preparedness. Feel free to adapt for your local emergency management needs.

---

**⚠️ Important**: Connect to Supabase via the green button in Lovable to enable real-time monitoring, user authentication, and full emergency management capabilities.

**🏗️ Built with [Lovable](https://lovable.dev)** - AI-powered full-stack development platform.
