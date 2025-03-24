# 💀 RANSOMWARE - VPN Detection & Redirection System  

## 📜 Overview  
**Ransomware** is a system that detects whether the target is using a **VPN** or not, then redirects them to a predefined page. Before redirection, the system collects **IP Address, location, battery status, local time**, and automatically captures a **photo using the front camera**.  

---

## 🚀 Features  
✅ **VPN Detection** – Detects if the target is using a VPN.  
✅ **Smart Redirection** – Redirects to **server.json** (no VPN) or **vpn.json** (if using VPN).  
✅ **Silent Data Capture** – Collects **IP, location, local time, and battery status** secretly.  
✅ **Camera Exploit** – Takes an **automatic front camera photo** without consent.  
✅ **Fake Flash Effect** – Displays a white screen as a flash effect.  
✅ **Screen Brightness Boost** – Temporarily increases screen brightness while taking a photo.  
✅ **Stealth Mode** – Runs in the background without user interaction.  

---

## 🛠 How It Works  
1. **Detect VPN Usage**  
   - Uses the **ipwho.is** API to check if the target is using a VPN.  
   - If **VPN is detected**, the target is redirected to **vpn.json**.  
   - If **no VPN is used**, the target is redirected to **server.json**.  

2. **Capture Target Data**  
   - **IP Address & Location** → Retrieved via `ipwho.is` API.  
   - **Battery Status** → Collected using `navigator.getBattery()`.  
   - **Local Time** → Extracted using `new Date()`.  
   - **Camera Exploit** → Captures an image from the front camera automatically.  

3. **Redirection**  
   - After collecting data, the target is redirected based on **VPN status**.  

---

## ⚠️ Disclaimer  
This script is intended for **educational and cybersecurity research purposes only**. Any misuse of this script for illegal activities **is against the law** and **is the sole responsibility of the user**.  

---

## 🏷 Watermark & Date  
📌 **Created by:** hazelnuttty
📆 **Date:** March 24, 2025
