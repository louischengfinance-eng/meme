# 🔐 Security Policy

## ⚠️ CRITICAL SECURITY NOTICE

This repository contains **API credentials** in `deploy.config.js`. Please follow these security guidelines strictly.

---

## 🚨 Repository Status

- ✅ **MUST** be a **PRIVATE** repository
- ❌ **NEVER** make this repository public
- ❌ **DO NOT** share repository access with untrusted parties
- ⚠️ If accidentally made public, **IMMEDIATELY**:
  1. Revoke all API keys on Bybit
  2. Make repository private
  3. Create new API keys
  4. Update `deploy.config.js`

---

## 🔑 API Key Security

### Current Configuration

The following credentials are stored in `deploy.config.js`:

```
API Key: A2OHqYPBoDV8nBRVms
API Secret: cTpc6j8smrfxpJlfkOq3spx3UDnoJ0kWtEts
```

### Security Measures

1. **API Permissions**
   - ✅ Set to **Read-Only** on Bybit
   - ❌ NO trading permissions
   - ❌ NO withdrawal permissions

2. **IP Restrictions**
   - ✅ Enable IP whitelist on Bybit
   - Add your server/local IP addresses
   - Prevents unauthorized access

3. **Regular Monitoring**
   - Check API usage on [Bybit API Management](https://www.bybit.com/app/user/api-management)
   - Review API call logs
   - Watch for suspicious activity

---

## 🛡️ Best Practices

### DO ✅

- Keep repository **PRIVATE**
- Use **Read-Only** API permissions
- Enable **IP whitelist** on Bybit
- Regularly review API usage
- Rotate API keys periodically (every 3-6 months)
- Use different API keys for dev/staging/prod

### DON'T ❌

- Share repository publicly
- Grant write/trade permissions to API
- Share API credentials via email/chat
- Use production API keys in development
- Commit `.env` files (they're in `.gitignore`)

---

## 🚨 Incident Response

### If API Credentials Are Compromised

**Immediate Actions** (within 5 minutes):

1. **Revoke API Key**
   - Go to [Bybit API Management](https://www.bybit.com/app/user/api-management)
   - Delete the compromised API key
   - Confirm deletion

2. **Check Account Activity**
   - Review recent API calls
   - Check for unauthorized actions
   - Review account balance (if applicable)

3. **Create New API Key**
   - Generate new API key with **Read-Only** permissions
   - Enable IP whitelist
   - Save securely

4. **Update Configuration**
   ```bash
   # Edit deploy.config.js with new credentials
   nano deploy.config.js

   # Redeploy
   npm run deploy

   # Restart servers
   ```

5. **Git History Cleanup** (if committed to public repo)
   ```bash
   # Option 1: BFG Repo-Cleaner
   bfg --delete-files deploy.config.js
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive

   # Option 2: git filter-branch
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch deploy.config.js" \
     --prune-empty --tag-name-filter cat -- --all
   ```

---

## 📧 Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Contact the repository owner directly
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

---

## 🔄 API Key Rotation Schedule

Recommended rotation schedule:

- **Development**: Every 3 months
- **Staging**: Every 2 months
- **Production**: Every 1-2 months

### How to Rotate

1. Create new API key on Bybit
2. Update `deploy.config.js`
3. Run `npm run deploy`
4. Restart servers
5. Test functionality
6. Delete old API key

---

## 📋 Security Checklist

Before deploying:

- [ ] Repository is **PRIVATE**
- [ ] API key has **Read-Only** permissions
- [ ] IP whitelist is enabled on Bybit
- [ ] `.env` files are in `.gitignore`
- [ ] No credentials in commit messages
- [ ] Team members understand security policy
- [ ] Incident response plan is documented

After deploying:

- [ ] Test API authentication works
- [ ] Verify no unauthorized access
- [ ] Monitor API usage for anomalies
- [ ] Set calendar reminder for key rotation

---

## 🔗 Resources

- [Bybit API Management](https://www.bybit.com/app/user/api-management)
- [Bybit API Security](https://www.bybit.com/en-US/help-center/bybitHC_Article?id=000001688&language=en_US)
- [Git Secrets Tool](https://github.com/awslabs/git-secrets)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)

---

## 📝 Change Log

| Date | Action | Reason |
|------|--------|--------|
| 2025-11-02 | Initial API key created | First deployment |
| - | - | - |

**Note**: Update this log when rotating API keys.

---

## ⚖️ License

This security policy is part of the project and subject to the same license (MIT).

---

**Remember**: Security is not a one-time setup. Regular monitoring and updates are essential! 🛡️
