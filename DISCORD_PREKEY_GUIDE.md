# 🎫 Discord Pre-Key Setup Guide

## 📋 Overview

The Discord `/prekey` command generates a temporary admin token that students use to unlock the exam (Tenta). This is the first step in a 2-step verification process.

---

## 🔧 Setup Instructions

### **1. Create Discord Application**

1. Go to: https://discord.com/developers/applications
2. Click **"New Application"**
3. Name it: `Quiz Pre-Access Bot`
4. Click **"Create"**

### **2. Get Bot Credentials**

#### **A. Public Key**
1. In your Discord app, go to **"General Information"**
2. Copy **"Public Key"**
3. Save for Netlify environment variables

#### **B. Application ID**
1. Still in **"General Information"**
2. Copy **"Application ID"**
3. Save for later

---

### **3. Add Bot to Your Discord Server**

1. Go to **OAuth2** → **URL Generator**
2. Select scopes:
   - ✅ `applications.commands`
3. Copy the generated URL
4. Open URL in browser
5. Select your Discord server
6. Click **"Authorize"**

---

### **4. Create Slash Command**

You can create the command via Discord API or manually:

#### **Option A: Using Discord Developer Portal (Recommended)**

Unfortunately Discord doesn't have a UI for this anymore. Use Option B.

#### **Option B: Using API (PowerShell)**

```powershell
# Set your credentials
$APP_ID = "YOUR_APPLICATION_ID"
$BOT_TOKEN = "YOUR_BOT_TOKEN"

# Create the /prekey command
$body = @{
    name = "prekey"
    type = 1
    description = "Generera pre-access token för tentamen"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bot $BOT_TOKEN"
    "Content-Type" = "application/json"
}

# Create global command
Invoke-RestMethod -Uri "https://discord.com/api/v10/applications/$APP_ID/commands" -Method Post -Headers $headers -Body $body
```

**Or create guild-specific command (faster for testing):**

```powershell
$GUILD_ID = "YOUR_DISCORD_SERVER_ID"

Invoke-RestMethod -Uri "https://discord.com/api/v10/applications/$APP_ID/guilds/$GUILD_ID/commands" -Method Post -Headers $headers -Body $body
```

---

### **5. Configure Netlify Environment Variables**

1. Go to: https://app.netlify.com/projects/quiz-natnael/settings/env
2. Add these variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `DISCORD_PUBLIC_KEY` | *Your public key* | From step 2A |
| `JWT_SECRET` | *Random secret string* | Generate with: `openssl rand -base64 32` |
| `DISCORD_ALLOWED_CHANNEL_ID` | *Optional channel ID* | Restrict command to specific channel |
| `DISCORD_BYPASS_VERIFY` | `false` | Set to `true` for local testing only |

**To get Channel ID:**
1. Enable Developer Mode in Discord (Settings → Advanced → Developer Mode)
2. Right-click your channel → Copy ID

---

### **6. Set Discord Interactions Endpoint**

1. Go back to Discord Developer Portal: https://discord.com/developers/applications
2. Select your application
3. Go to **"General Information"**
4. In **"Interactions Endpoint URL"**, enter:
   ```
   https://quiz-natnael.netlify.app/.netlify/functions/discordInteractions
   ```
5. Click **"Save Changes"**
6. Discord will verify the endpoint (should show ✅)

---

## 🎮 How It Works

### **User Flow:**

```
1. Student types `/prekey` in Discord
   ↓
2. Bot generates JWT token (valid 30 minutes)
   ↓
3. Student receives token in Discord DM or channel
   ↓
4. Student goes to quiz site
   ↓
5. Student clicks "TENTA: PLU"
   ↓
6. Student enters pre-key token
   ↓
7. Student enters email to receive exam unlock key
   ↓
8. Student receives exam key via email
   ↓
9. Student enters exam key to unlock tenta
   ↓
10. Tenta is unlocked ✅
```

### **Technical Flow:**

```javascript
// Step 1: Discord command
User: /prekey
  ↓
Discord → /.netlify/functions/discordInteractions
  ↓
Function generates JWT token:
{
  scope: "pre",
  exp: now + 30 minutes
}
  ↓
Returns token to Discord
  ↓
Discord shows: "Första stegets token (giltig i 30 min): `token_here`"

// Step 2: Verify pre-key
User enters token in quiz app
  ↓
Frontend → /.netlify/functions/verifyPreAccess
  ↓
Validates JWT signature and expiration
  ↓
If valid, returns new token
  ↓
User can request exam unlock key

// Step 3: Request exam key
User enters email
  ↓
Frontend → /.netlify/functions/requestUnlock
  ↓
Generates exam unlock key
  ↓
Sends key via Resend email service

// Step 4: Unlock exam
User enters exam key
  ↓
Frontend → /.netlify/functions/verifyUnlock
  ↓
Validates key
  ↓
Returns exam token (valid for exam duration)
  ↓
Tenta unlocked ✅
```

---

## 🧪 Testing

### **Local Testing:**

```powershell
# Start Netlify Dev
cd c:\dev_natti\quiz\quiz-app
npm run dev:netlify

# Test Discord command simulation
$body = @{
    type = 2
    data = @{
        name = "prekey"
    }
    channel_id = "test-channel-123"
} | ConvertTo-Json

# Call function locally
Invoke-RestMethod -Uri "http://localhost:8888/.netlify/functions/discordInteractions" -Method Post -Body $body -ContentType "application/json"
```

### **Production Testing:**

1. Go to your Discord server
2. Type `/prekey` in allowed channel
3. Should receive: `Första stegets token (giltig i 30 min): eyJhbG...`
4. Copy token
5. Go to quiz site → Click TENTA
6. Paste token in "Steg 1: Verifiera admin-nyckel"
7. Should proceed to email step

---

## 🔒 Security Features

### **1. Signature Verification**
- Discord signs all requests with Ed25519
- Prevents replay attacks and unauthorized requests

### **2. Channel Restriction**
- Optional: Limit command to specific channel
- Set `DISCORD_ALLOWED_CHANNEL_ID` in Netlify

### **3. Time-Limited Tokens**
- Pre-key valid for 30 minutes only
- Prevents token reuse after expiration

### **4. JWT Signing**
- All tokens cryptographically signed
- Validates authenticity

### **5. Two-Step Process**
- Pre-key → Exam unlock key
- Prevents direct exam access

---

## 🛠️ Customization

### **Change Token Expiration:**

Edit `netlify/functions/discordInteractions.js`:
```javascript
if (name === "prekey") {
  const ttl = 60; // Change from 30 to 60 minutes
  // ...
}
```

### **Add Multiple Commands:**

```javascript
if (name === "prekey") {
  // Existing code
} else if (name === "examkey") {
  // New command for direct exam key
  // ...
}
```

### **Customize Message:**

```javascript
const content = `
🎫 Din Pre-Access Token:
\`${token}\`

✅ Giltig i ${ttl} minuter
📝 Använd denna på quiz-sidan för att begära tentanyckel
`;
```

---

## 📊 Monitoring

### **Check Command Usage:**

```powershell
# View function logs
npx netlify functions:log discordInteractions --follow
```

### **Verify Token Generation:**

The JWT payload contains:
```json
{
  "scope": "pre",
  "iat": 1699112345,
  "exp": 1699114145
}
```

Decode at: https://jwt.io

---

## 🐛 Troubleshooting

### **Issue: "invalid request signature"**

**Cause:** Discord public key mismatch or missing

**Fix:**
1. Verify `DISCORD_PUBLIC_KEY` in Netlify matches Discord Developer Portal
2. Check signature verification isn't bypassed unintentionally
3. Ensure endpoint URL is correct in Discord settings

### **Issue: "Missing DISCORD_PUBLIC_KEY"**

**Fix:** Add environment variable in Netlify:
```
DISCORD_PUBLIC_KEY=your_public_key_here
```

### **Issue: Command not showing in Discord**

**Fix:**
1. Wait 5-10 minutes for Discord to sync commands
2. Kick and re-invite bot
3. Try creating guild-specific command (faster)
4. Check bot has `applications.commands` scope

### **Issue: "Kommandot får bara användas i den angivna kanalen"**

**Fix:**
- Either remove `DISCORD_ALLOWED_CHANNEL_ID` from Netlify
- Or use command in the specified channel
- Get channel ID: Enable Developer Mode → Right-click channel → Copy ID

### **Issue: Token expired when student tries to use it**

**Fix:**
- Increase `ttl` value (currently 30 minutes)
- Remind students to use token immediately
- Generate new token with `/prekey`

---

## 🔗 Related Files

- **Discord Handler:** `netlify/functions/discordInteractions.js`
- **Pre-Key Verification:** `netlify/functions/verifyPreAccess.js`
- **Exam Unlock Request:** `netlify/functions/requestUnlock.js`
- **Exam Unlock Verification:** `netlify/functions/verifyUnlock.js`
- **JWT Utilities:** `netlify/functions/jwtUtils.js`

---

## 📝 Quick Reference

### **Environment Variables Required:**

```env
# Discord
DISCORD_PUBLIC_KEY=your_discord_public_key
DISCORD_ALLOWED_CHANNEL_ID=optional_channel_id_restriction

# JWT
JWT_SECRET=your_random_secret_32_chars_minimum

# Email (for requestUnlock)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM=noreply@yourdomain.com
RESEND_TO=student@email.com

# Exam Secret (for unlock key generation)
EXAM_SECRET=your_exam_secret_key
```

### **Discord Setup Checklist:**

- [ ] Create Discord application
- [ ] Copy Public Key
- [ ] Add bot to server
- [ ] Create `/prekey` command via API
- [ ] Set Interactions Endpoint URL
- [ ] Add `DISCORD_PUBLIC_KEY` to Netlify
- [ ] Add `JWT_SECRET` to Netlify
- [ ] Test command in Discord
- [ ] Verify token in quiz app

---

## 🎯 Best Practices

1. **Keep JWT_SECRET secure** - Never commit to git
2. **Use channel restrictions** - Prevent spam in public channels
3. **Monitor logs** - Watch for unusual activity
4. **Rotate secrets** - Change JWT_SECRET periodically
5. **Test before exams** - Verify flow works end-to-end

---

**Last Updated:** November 4, 2025  
**Version:** 1.0.0
