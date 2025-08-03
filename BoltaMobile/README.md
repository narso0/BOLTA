# Bolta Mobile - React Native Fitness App

A complete step tracking mobile app with native sensor integration and coin rewards system.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Expo Go app on your mobile device
- Same WiFi network for device and computer

### Setup & Run

```bash
# 1. Clone and navigate
git clone https://github.com/narso0/BOLTA.git
cd BOLTA/BoltaMobile

# 2. Install dependencies
npm install

# 3. Start development server
npx expo start

# 4. Scan QR code with Expo Go app
```

## 📱 Features

### ✅ Working Features
- **🚶 Real Step Tracking**: Native accelerometer-based step detection
- **🪙 Coin System**: Earn 1 coin per 1,000 steps
- **📊 Dashboard**: Real-time step counter with progress ring
- **📏 Distance Tracking**: Automatic distance calculation
- **🔥 Calorie Tracking**: Calories burned based on steps
- **💾 Data Persistence**: Steps saved locally with AsyncStorage
- **🔄 Daily Reset**: Automatic reset at midnight
- **⚙️ Permission Management**: Motion sensor permission handling
- **🎯 Goal Progress**: 10,000 step daily goal tracking

### 🎮 Test Features
- **➕ Add Steps**: Manual step addition for testing
- **▶️ Start/Stop Tracking**: Toggle motion sensor tracking
- **🔄 Reset Daily**: Manual daily data reset

## 🏗️ Technical Stack

- **Framework**: React Native + Expo SDK 53
- **Sensors**: expo-sensors for motion detection
- **Storage**: AsyncStorage for local data persistence
- **Language**: TypeScript
- **UI**: React Native components with custom styling

## 📋 Permissions

### Android
- `ACTIVITY_RECOGNITION` - For step tracking
- `ACCESS_FINE_LOCATION` - For improved accuracy (optional)
- `ACCESS_COARSE_LOCATION` - For location features (optional)

### iOS
- **Motion & Fitness** - For step tracking

## 🔧 Development

### Project Structure
```
BoltaMobile/
├── src/
│   ├── components/
│   │   └── Dashboard.tsx      # Main UI component
│   ├── hooks/
│   │   └── useStepCounter.ts  # Step tracking logic
│   └── types/
│       └── index.ts           # TypeScript definitions
├── App.tsx                    # Root component
├── index.js                   # Expo entry point
├── package.json               # Dependencies
└── app.json                   # Expo configuration
```

### Key Components

**useStepCounter Hook:**
- Motion sensor integration
- Step detection algorithm
- Data persistence
- Coin calculation

**Dashboard Component:**
- Step counter UI
- Progress visualization
- Control buttons
- Status indicators

## 🚶 Step Detection Algorithm

- Uses device accelerometer (x, y, z axes)
- Peak detection with magnitude thresholds
- Motion buffer for pattern recognition
- Time interval filtering to prevent false positives

## 💰 Coin System

- **Rate**: 1 coin per 1,000 steps
- **Automatic**: Calculated in real-time
- **Persistent**: Coins accumulate across sessions

## 🎯 Usage

1. **Grant Permissions**: Allow motion sensor access
2. **Start Tracking**: Tap "Start Tracking" button
3. **Walk Around**: App detects steps automatically
4. **View Progress**: Watch real-time updates
5. **Earn Coins**: 1 coin per 1,000 steps

## 🐛 Troubleshooting

### Common Issues

**App won't start:**
```bash
rm -rf node_modules package-lock.json
npm install
npx expo start --clear
```

**No step detection:**
- Ensure motion permissions are granted
- Try walking with phone in pocket/hand
- Test with "Add Steps" button first

**QR code not working:**
- Ensure same WiFi network
- Try `npx expo start --tunnel`
- Use Expo Go app to scan (not camera on Android)

### Performance Tips
- Step detection runs at 10Hz for optimal battery usage
- App automatically stops sensors when backgrounded
- Data is saved locally for offline functionality

## 📈 Future Enhancements

- Firebase integration for cloud sync
- Apple Health / Google Fit integration
- Social features and leaderboards
- Marketplace for spending coins
- Advanced analytics and insights

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Test on physical device
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Ready to start tracking? Install Expo Go and scan the QR code!** 🚶‍♂️💰