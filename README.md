# iMediaTop Web

> 🇮🇹 Sito web multipagina ufficiale di iMediaTop.  
> Progetto sviluppato in HTML, CSS e JavaScript vanilla con focus su architettura frontend, performance e animazioni custom.

---

## 🌍 Live Website

🔗 https://www.imediatop.it/

---

## 📌 Overview

Official multi-page corporate website developed for the iMediaTop brand.

The project was built entirely with native web technologies, without frontend frameworks, focusing on:

- Structured semantic markup  
- Advanced UI interactions  
- Custom canvas-based animations  
- Performance-conscious implementation  
- Clean and modular JavaScript architecture  

The goal was to create a scalable, maintainable and technically solid frontend foundation.

---

## 🛠 Tech Stack

- HTML5 (semantic structure)
- CSS3 (single modular stylesheet)
- Vanilla JavaScript (IIFE modular architecture)
- Canvas API
- IntersectionObserver API
- Optional GSAP progressive enhancement
- EmailJS (contact handling)

No frontend framework was used.

---

## 🧠 Frontend Architecture

The JavaScript is organized using isolated IIFE modules to:

- Prevent global scope pollution  
- Improve maintainability  
- Keep logic encapsulated  
- Enable progressive enhancement  

Each interaction system is self-contained (canvas animations, timeline logic, pricing toggle, navbar behavior, contact validation, etc.).

---

## 🎨 Advanced UI & Animations

The website includes several custom-built interaction systems:

### Neural Header Canvas
- Particle system with mouse attraction
- Dynamic connection lines
- Adaptive density (desktop / tablet / mobile)
- requestAnimationFrame optimized loop

### CTA Wave Canvas
- Perspective wave simulation
- Sprite-based rendering
- IntersectionObserver pause/resume
- Visibility API optimization

### Scroll-Based Systems
- Timeline progression logic
- Line fill animation
- Section reveal animations
- Counter animations with easing
- Active navigation highlighting

### Micro-interactions
- 3D card tilt
- Cursor glow tracking
- Expandable content blocks
- Pricing toggle logic
- Mobile navigation controller

All interactions are implemented using native APIs with performance optimizations.

---

## ⚡ Performance Approach

- IntersectionObserver for scroll-triggered animations
- Animation pausing when offscreen
- Device Pixel Ratio capped for canvas
- Reduced density on smaller screens
- Passive scroll listeners
- No heavy frameworks

The project prioritizes lightweight execution and smooth rendering.

---

## 🧠 SEO & Accessibility

- Semantic HTML5 landmarks (`nav`, `header`, `main`, `section`, `article`, `footer`)
- Proper heading hierarchy
- Meta description optimization
- ARIA attributes where necessary
- Clean internal linking structure

The markup is structured for both search engines and real users.

---

## ✨ Key Characteristics

- Multi-page architecture
- Framework-free implementation
- Custom animation systems
- Modular JavaScript design
- Responsive layout
- Client-side validation logic

---

## 👨‍💻 Author

Developed by **Enzo Tedeschi**

---

## 📄 License

All rights reserved.