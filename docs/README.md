# 📚 Project Documentation

Welcome to the **Agent AI Market** project documentation!

## 🚀 Quick Start

To get started with the project, go to the
**[Getting Started](./getting-started/README.md)** section.

## 🗂️ Documentation Structure

- **[🚀 Getting Started](./getting-started/)** - project overview and quick start
- **[🏗️ Architecture](./architecture/)** - architectural decisions and principles
- **[🎨 Frontend](./frontend/)** - user interface development
- **[🔍 SEO](./seo/)** - search engine optimization
- **[🔧 Development](./development/)** - development processes and environment
  variables
- **[📖 Reference](./reference/)** - technical references

## 🛠️ Useful Scripts

### Sitemap Automation

```bash
# Update sitemap
npm run sitemap

# Monitor status
npm run sitemap:status

# Check canonical URL
npm run sitemap:check
```

**Run after:**

- Adding new pages
- Changing route structure
- Before release for SEO check
- Each deployment (automatically)

### Canonical URL Check

```bash
# Check canonical URLs
npm run sitemap:check

# Check specific page
npm run sitemap:check -- --page=/specific-page
```

**Run after:**

- Adding new pages
- Changing route structure
- Before release for SEO check

## 🔐 Verification Files

When connecting the site to search engines, verification files may be required:

- **Yandex.Webmaster**: `public/yandex_*.html`
- **Google Search Console**: `public/google_*.html`
- **Bing Webmaster**: `public/bing_*.html`

**Important:** Verification files are not indexed and can be removed after
confirming domain ownership.

## 🎯 Who This Documentation Is For

- **Developers** - architecture, API, development processes
- **SEO Specialists** - search engine optimization
- **Designers** - components and styling
- **Managers** - project overview and processes

## 📞 Support

If you have questions or suggestions for improving the documentation:

- Create an issue in the repository
- Contact the development team

---

**Last updated**: August 2025
