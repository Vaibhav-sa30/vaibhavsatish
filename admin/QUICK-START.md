# 🚀 Quick Start: Adding a New Project

## 5-Minute Workflow

### 1️⃣ Open the Form
```bash
start admin/project-form.html
```

### 2️⃣ Fill & Generate
- Fill in all project details
- Click "Generate JSON"
- Click "📋 Copy to Clipboard"

### 3️⃣ Update Code
Open `js/components/projects.js` and add your project:

```javascript
const projectsData = [
    { /* existing project */ },
    { /* existing project */ },
    // 👇 Paste your new project here (don't forget the comma above!)
    {
        "id": "your-new-project",
        "title": "Your Project",
        // ... rest of generated JSON
    }
];
```

### 4️⃣ Add Images
Save 2 screenshots as:
- `assets/images/[project-id]-1.jpg`
- `assets/images/[project-id]-2.jpg`

**Image specs**: 1200x800px, < 500KB, JPG/WebP

### 5️⃣ Deploy
```bash
git add js/components/projects.js assets/images/
git commit -m "Add new project: [Project Name]"
git push origin main
```

✅ **Done!** Your website updates automatically in 2-3 minutes.

---

## 📝 Field Tips

| Field | Tips |
|-------|------|
| **Project ID** | Auto-generated, lowercase-with-dashes |
| **Title** | Clear, concise project name |
| **Category** | fullstack / ml / data-analysis / research |
| **Short Desc** | 2-3 sentences for project card |
| **Long Desc** | 3-5 sentences with technical details |
| **Technologies** | Comma-separated, 4-8 main techs |
| **Outcomes** | One per line, use metrics when possible |
| **Featured** | Mark 3-4 best projects as featured |

## 🎯 Writing Great Outcomes

✅ **Good Examples:**
- "Achieved 95% accuracy on test dataset"
- "Reduced processing time by 50%"
- "Ranked top 10% among 2,000+ participants"
- "Published research at ACM Summer School"

❌ **Avoid:**
- "Made it work"
- "Good project"
- "Used Python"

## 🐛 Common Issues

**Images not showing?**
- Check filename matches project ID
- Verify images are in `assets/images/`
- Clear browser cache (Ctrl+Shift+R)

**JSON error?**
- Check for missing commas between projects
- Validate at [jsonlint.com](https://jsonlint.com)
- Ensure all quotes are closed

**Project not appearing?**
- Wait 2-3 minutes for deployment
- Check GitHub Actions status
- Clear browser cache

---

📖 **Full guide**: [admin/README.md](README.md)
