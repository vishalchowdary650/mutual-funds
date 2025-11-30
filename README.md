[readme.md](https://github.com/user-attachments/files/23837104/readme.md)
# Mutual Fund Decision Platform (Starter)

This is a starter static website for the FEDF-PS06 project: *Investment perception and selection behavior towards mutual funds*.

Features:
- Simple multi-page static site (Investor / Advisor / Admin / Analyst)
- Sample fund JSON data in `data/funds.json`
- Small JS app to render funds and compare 1-year returns (uses Chart.js CDN)
- Ready to push to GitHub and host via GitHub Pages

## How to use

1. Preview locally:
   ```
   # from the project root
   python -m http.server 8000
   # then open http://localhost:8000
   ```

2. To push to GitHub (example):
   ```
   git init
   git add .
   git commit -m "Initial website commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/mutual-fund-platform.git
   git push -u origin main
   ```

## Notes
This is a static starter. For production consider adding:
- Backend for authentication and persistent data
- Secure admin dashboard and role-based access
- Real fund data ingestion and validation
