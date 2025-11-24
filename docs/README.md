# RemitBuddy Technical Documentation

**Welcome to the RemitBuddy technical documentation!**

This documentation is designed to onboard new team members (CPO, CTO, developers) and provide comprehensive reference material for the RemitBuddy platform.

---

## 📚 Documentation Structure

### **For Executives (CPO, CTO)**

Start here for high-level understanding:

1. **[00-OVERVIEW.md](./00-OVERVIEW.md)** - Executive Summary
   - What is RemitBuddy?
   - Architecture at a glance
   - Technology stack
   - Business model & metrics
   - Risk assessment
   - Strategic priorities

---

### **For Technical Leadership (CTO, Lead Developers)**

Deep dive into architecture and design:

2. **[01-ARCHITECTURE.md](./01-ARCHITECTURE.md)** - Detailed Architecture
   - System architecture diagrams
   - Design patterns used
   - Component breakdown
   - Data flow
   - Caching strategy
   - Proxy management system
   - Error handling
   - Security architecture
   - Performance optimization
   - Scalability considerations

---

### **For Backend Developers**

API reference and implementation details:

3. **[02-BACKEND-API.md](./02-BACKEND-API.md)** - Backend API Documentation
   - API endpoint reference
   - Provider implementation details
   - Request/response formats
   - Error codes
   - Rate limiting
   - Authentication (none currently)
   - Country/currency mappings
   - Development examples

---

### **For Frontend Developers**

UI/UX implementation guide:

4. **[03-FRONTEND.md](./03-FRONTEND.md)** - Frontend Documentation
   - Technology stack
   - Project structure
   - Design system (Toss-inspired)
   - Component library
   - Internationalization (11 languages)
   - Routing
   - State management
   - Performance optimization
   - Accessibility

---

### **For DevOps Engineers**

Deployment and operations:

5. **[04-DEPLOYMENT.md](./04-DEPLOYMENT.md)** - Deployment & DevOps
   - Netlify deployment (frontend)
   - Railway deployment (backend)
   - DNS configuration
   - SSL/TLS setup
   - Monitoring & observability
   - CI/CD pipeline
   - Backup & disaster recovery
   - Scaling strategy
   - Security hardening
   - Cost optimization
   - Troubleshooting guide
   - Emergency procedures

---

### **For All Developers**

Local development setup:

6. **[05-DEVELOPMENT.md](./05-DEVELOPMENT.md)** - Development Setup & Guidelines
   - Prerequisites & installation
   - Environment setup
   - Running locally
   - Development workflow
   - Code style guidelines
   - Testing (future)
   - Debugging tips
   - Common tasks
     - Adding new providers
     - Adding new languages
     - Updating dependencies
   - Troubleshooting
   - Useful commands

---

## 🚀 Quick Start

### For New Team Members

**5-Minute Onboarding**:
1. Read **[00-OVERVIEW.md](./00-OVERVIEW.md)** - Get the big picture
2. Skim your relevant section (Backend/Frontend/DevOps)
3. Follow **[05-DEVELOPMENT.md](./05-DEVELOPMENT.md)** to set up locally
4. Make your first contribution!

**First Week Goals**:
- [ ] Understand the architecture
- [ ] Run the app locally
- [ ] Make a small change (e.g., fix typo, update docs)
- [ ] Deploy to staging
- [ ] Review codebase

---

## 📖 Reading Guide by Role

### **Product Manager / CPO**
Focus on:
- ✅ 00-OVERVIEW.md (complete read)
- 📖 01-ARCHITECTURE.md (skim sections: System Architecture, Key Features)
- 📖 03-FRONTEND.md (skim sections: Design System, i18n)
- 📖 04-DEPLOYMENT.md (skim sections: Monitoring, Cost Optimization)

**Time**: 30-45 minutes

### **CTO / Technical Leadership**
Read all documents, focusing on:
- ✅ 00-OVERVIEW.md (complete)
- ✅ 01-ARCHITECTURE.md (complete)
- 📖 02-BACKEND-API.md (focus on architecture sections)
- 📖 03-FRONTEND.md (focus on design patterns)
- ✅ 04-DEPLOYMENT.md (complete)
- 📖 05-DEVELOPMENT.md (skim for team onboarding)

**Time**: 2-3 hours

### **Backend Developer**
- ✅ 00-OVERVIEW.md
- ✅ 01-ARCHITECTURE.md (focus on backend patterns)
- ✅ 02-BACKEND-API.md
- ✅ 05-DEVELOPMENT.md
- 📖 04-DEPLOYMENT.md (skim)

**Time**: 1.5-2 hours

### **Frontend Developer**
- ✅ 00-OVERVIEW.md
- ✅ 01-ARCHITECTURE.md (focus on frontend patterns)
- ✅ 03-FRONTEND.md
- ✅ 05-DEVELOPMENT.md
- 📖 04-DEPLOYMENT.md (skim)

**Time**: 1.5-2 hours

### **DevOps Engineer**
- ✅ 00-OVERVIEW.md
- ✅ 01-ARCHITECTURE.md (focus on infrastructure)
- 📖 02-BACKEND-API.md (skim for health check endpoints)
- ✅ 04-DEPLOYMENT.md
- ✅ 05-DEVELOPMENT.md

**Time**: 1.5-2 hours

---

## 🎯 Key Concepts

### Architecture Philosophy
- **Stateless**: No database, all data real-time
- **Microservices-inspired**: Clear separation of concerns
- **Mobile-first**: Optimized for mobile users
- **Performance**: 60s cache, parallel scraping
- **Reliability**: Proxy rotation, circuit breakers

### Technology Choices
- **FastAPI**: Modern, async Python framework
- **Next.js**: React framework with SSR/SSG
- **Tailwind CSS**: Utility-first styling
- **Toss-inspired Design**: Trust and professionalism

### Business Model
- **Free Service**: No user fees
- **Revenue**: Google AdSense ads
- **Future**: Affiliate links, B2B API

---

## 📊 System Metrics

### Current Scale
- **10 Countries**: Vietnam, Philippines, Nepal, Thailand, Myanmar, Indonesia, Cambodia, Uzbekistan, Sri Lanka, Bangladesh
- **10 Providers**: Hanpass, Cross, GmoneyTrans, GME Remit, JP Remit, The Moin, Wirebarley, SBI Cosmoney, E9Pay, Coinshot
- **11 Languages**: English, Korean, Vietnamese, Tagalog, Khmer, Burmese, Thai, Uzbek, Indonesian, Sinhala, Nepali
- **Response Time**: 50ms (cache hit) / 2-3s (cache miss)
- **Cache TTL**: 60 seconds
- **Rate Limit**: 15 requests / 60 seconds per IP

### Infrastructure
- **Frontend**: Netlify CDN (global)
- **Backend**: Railway (single container)
- **Cost**: ~$6/month
- **Uptime**: 99.9% (estimated)

---

## 🔍 Finding Information

### Quick Reference

**Need to...**
- Understand the business? → **00-OVERVIEW.md**
- Learn about design patterns? → **01-ARCHITECTURE.md**
- Add a new provider? → **02-BACKEND-API.md** + **05-DEVELOPMENT.md**
- Customize the UI? → **03-FRONTEND.md**
- Deploy to production? → **04-DEPLOYMENT.md**
- Set up locally? → **05-DEVELOPMENT.md**
- Troubleshoot an issue? → **04-DEPLOYMENT.md** (Troubleshooting section)
- Add a new language? → **03-FRONTEND.md** (i18n) + **05-DEVELOPMENT.md**

### Code Locations

**Backend**:
- Main API: `backend/main.py`
- Proxy Manager: `backend/proxy_manager.py`
- Proxy Config: `backend/proxy_config.py`

**Frontend**:
- Main Page: `frontend/pages/index.js`
- Components: `frontend/components/`
- Styles: `frontend/styles/globals.css`
- Design System: `frontend/tailwind.config.js`

**Deployment**:
- Frontend: `frontend/netlify.toml`
- Backend: `Dockerfile`, `railway.json`

---

## 🤝 Contributing

### Making Changes

1. **Read relevant documentation first**
2. **Set up local environment** (05-DEVELOPMENT.md)
3. **Create a feature branch**
4. **Make changes and test locally**
5. **Update documentation if needed**
6. **Submit pull request**

### Updating Documentation

When you make significant changes to the codebase:
- Update relevant documentation files
- Keep examples up-to-date
- Add screenshots if helpful
- Update version numbers

---

## 📞 Support & Contact

### Getting Help

**Questions about the code?**
- Check documentation first
- Review code comments
- Ask in team chat

**Found an issue?**
- Check troubleshooting sections
- Review logs
- Create GitHub issue

**Need urgent help?**
- Contact CTO
- Check emergency procedures (04-DEPLOYMENT.md)

---

## 📝 Documentation Maintenance

### Last Updated
**Date**: 2025-11-24
**Version**: 1.0
**Prepared by**: Claude AI for RemitBuddy Team

### Review Schedule
- **Monthly**: Quick review for outdated information
- **Quarterly**: Comprehensive review and updates
- **After major changes**: Immediate documentation updates

### Feedback
If you find any errors or have suggestions for improvement:
1. Create a GitHub issue with label `documentation`
2. Or update the docs directly and submit a PR

---

## 🎓 Additional Resources

### External Documentation
- **FastAPI**: https://fastapi.tiangolo.com/
- **Next.js**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React**: https://react.dev/

### Internal Resources
- **API Docs** (Swagger): https://remitbuddy-production.up.railway.app/docs
- **GitHub Repository**: (your private repo)
- **Netlify Dashboard**: (team access)
- **Railway Dashboard**: (team access)

---

## 🌟 Next Steps

**New to RemitBuddy?**
1. ✅ Read 00-OVERVIEW.md
2. ✅ Read your role-specific documentation
3. ✅ Set up local environment (05-DEVELOPMENT.md)
4. ✅ Make your first contribution
5. ✅ Join the team!

**Ready to build?**
Let's make remittance comparison easier for everyone! 🚀

---

**Happy Coding!** 💻
