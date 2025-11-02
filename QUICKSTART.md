# ⚡ Quick Start Guide

Get the crypto monitoring dashboard running in 3 minutes!

## 🚀 Super Fast Setup

### Step 1: Install Dependencies (2 minutes)

```bash
# Clone and enter directory (if not already there)
cd /path/to/meme

# Install all dependencies at once
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### Step 2: Verify Configuration (30 seconds)

Your Bybit API credentials are already configured! Check:

```bash
cat backend/.env
```

You should see:
```
BYBIT_API_KEY=A2OHqYPBoDV8nBRVms
BYBIT_API_SECRET=cTpc6j8smrfxpJlfkOq3spx3UDnoJ0kWtEts
```

✅ If you see your credentials, you're ready to go!

### Step 3: Start the Application (30 seconds)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

Wait for: `🚀 Server running on http://localhost:3001`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

Wait for: `✓ Ready on http://localhost:3000`

### Step 4: Open Dashboard

Open your browser to: **http://localhost:3000**

🎉 **Done!** You should see the crypto monitoring dashboard loading data from Bybit!

---

## ✅ First Time Checklist

After the dashboard loads:

1. ✅ You see "Crypto Monitoring Dashboard" header
2. ✅ Data is loading (blue "Updating..." indicator)
3. ✅ Table shows 20 crypto pairs with prices
4. ✅ Green percentages for gainers, red for losers
5. ✅ "Last Update" timestamp is recent

## 🎮 Try These Features

### Switch Views
- Click **📈 Top 20 Gainers** (green button) to see biggest winners
- Click **📉 Top 20 Losers** (red button) to see biggest losers

### Enable Notifications
1. Click the **"Enable"** button in the Notifications card
2. Allow notifications when your browser asks
3. You'll get alerts when coins drop fast!

### Sound Alerts
- Toggle **"🔊 Sound On"** to hear audio alerts
- Toggle **"🔇 Sound Off"** to mute

### Sort Data
- Click any column header to sort
- Click again to reverse sort order
- Try sorting by: Price, 24h %, Volume, etc.

## 🔔 What Are Alerts?

The system watches the **top 20 gainers** constantly. If any of them drops **≥3%** within 1 hour:

- 🔴 Row turns red and blinks
- ⚠ Alert badge appears
- 🔔 Browser notification (if enabled)
- 🔊 Sound plays (if enabled)

**Why?** Fast drops in hot coins often signal important market moves!

## 📊 Understanding the Data

| Column | What It Shows |
|--------|---------------|
| **Symbol** | Trading pair (e.g., BTC/USDT) |
| **Price** | Current price in USDT |
| **24h %** | Price change in last 24 hours |
| **24h High** | Highest price in last 24 hours |
| **24h Low** | Lowest price in last 24 hours |
| **Volume** | Trading volume in USDT |

- 🟢 **Green** = Price went up
- 🔴 **Red** = Price went down

## 🔧 Quick Troubleshooting

### "No data showing"
1. Check backend terminal - any errors?
2. Check frontend terminal - any errors?
3. Try: `curl http://localhost:3001/api/health`

### "Failed to fetch ticker data"
1. Check your internet connection
2. Verify Bybit API credentials in `backend/.env`
3. Check if your API key is active on Bybit

### Backend won't start
- Port 3001 might be in use
- Kill the process: `lsof -i :3001` then `kill -9 <PID>`

### Frontend won't start
- Port 3000 might be in use
- Kill the process: `lsof -i :3000` then `kill -9 <PID>`

## 📖 Need More Help?

- **Full Setup Guide**: See [SETUP.md](./SETUP.md)
- **Architecture Details**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Project Overview**: See [README.md](./README.md)

## 🎯 Next Steps

1. ✅ Dashboard is running
2. 📊 Explore the data
3. 🔔 Enable notifications
4. 📈 Watch for alerts
5. 🎨 Customize settings (see SETUP.md)

---

**Pro Tip**: Keep both terminals open while using the dashboard. You'll see real-time logs and can spot any issues immediately!

**Data Updates**: The dashboard automatically refreshes every 5 seconds. No need to manually reload!

**Rate Limits**: Your authenticated Bybit API has higher rate limits than public access. You're good for heavy usage! 🚀
