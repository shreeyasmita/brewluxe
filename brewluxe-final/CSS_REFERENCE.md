# 🎨 BREWLUXE CSS Classes Reference

## New CSS Classes Added

### Theme Toggle
```css
.theme-toggle
- Background: semi-transparent gold
- Border: 1px solid gold
- Interactive hover state
- Width/Height: 40px
- Font size: 20px
```

### Specials Section
```css
.specials-carousel
- Max-width: 1000px
- Auto-centered
- Position: relative

.special-card
- Linear gradient background (gold to brown)
- Backdrop blur effect
- Flex layout for icon + info
- Hover translate effect (10px right)
- Border: 1px solid gold
- Padding: 2.5rem

.special-icon
- Font-size: 60px
- Min-width: 80px
- Text-aligned center

.special-badge
- Background: Red (#e74c3c)
- Color: White
- Font-weight: Bold
- Border-radius: 5px
- Padding: 0.3rem 0.8rem
```

### Barista Cards
```css
.barista-grid
- Grid: auto-fit, minmax(250px, 1fr)
- Gap: 2rem
- Margin-top: 2rem

.barista-card
- Background: glass effect
- Backdrop blur: 10px
- Border-radius: 20px
- Padding: 2rem
- Text-align: center
- Hover: translateY(-15px)
- Box-shadow increase on hover

.barista-avatar
- Width/Height: 120px
- Border-radius: 50%
- Border: 3px solid gold
- Display: flex (centered content)
- Font-size: 50px
- Background: semi-transparent gold

.barista-badge
- Display: inline-block
- Background: Gold
- Color: White
- Padding: 0.3rem 0.8rem
- Border-radius: 20px
- Font-size: 0.8rem
```

### Order Tracking
```css
.tracking-section
- Max-width: 700px
- Margin: 2rem auto
- Background: glass
- Border-radius: 20px
- Padding: 2rem

.tracking-steps
- Display: flex
- Justify-content: space-between
- Align-items: center
- Margin: 2rem 0
- Position: relative

.tracking-step
- Flex: 1
- Text-align: center
- Position: relative
- z-index: 2

.step-icon
- Width/Height: 60px
- Background: Gold (#c9a96e)
- Border-radius: 50%
- Flex centered
- Font-size: 28px
- Color: White
- Box-shadow: Gold glow
- Margin: 0 auto 0.5rem

.step-icon.completed
- Background: Green (#27ae60)

.step-line
- Position: absolute
- Top: 30px
- Height: 2px
- Background: semi-transparent gold
- z-index: 1

.step-line.completed
- Background: Green (#27ae60)

.availability-badge
- Display: inline-flex
- Gap: 0.5rem
- Background: semi-transparent green
- Border: 1px solid green
- Color: Green
- Padding: 0.5rem 1rem
- Border-radius: 20px
- Font-size: 0.9rem
- Font-weight: 600

.availability-dot
- Width/Height: 8px
- Background: Green (#27ae60)
- Border-radius: 50%
- Animation: pulse 2s infinite
```

### Gift Cards
```css
.gift-cards-grid
- Grid: auto-fit, minmax(280px, 1fr)
- Gap: 2rem
- Margin-top: 2rem

.gift-card
- Background: Linear gradient (gold to brown)
- Border-radius: 20px
- Padding: 2.5rem
- Color: White
- Text-align: center
- Cursor: pointer
- Transition: transform, box-shadow
- Box-shadow: Gold glow
- Hover: scale(1.05)
- Hover: increased box-shadow

.gift-amount
- Font-size: 2.5rem
- Font-weight: 700
- Margin-bottom: 0.5rem

.gift-description
- Font-size: 0.9rem
- Opacity: 0.9
- Margin-bottom: 1rem

.gift-btn
- Background: White
- Color: Gold
- Padding: 0.8rem 1.5rem
- Border: None
- Border-radius: 20px
- Cursor: pointer
- Font-weight: 600
- Transition: all 0.3s
- Hover: translateY(-2px)
- Hover: box-shadow effect
```

### Mobile App Promotion
```css
.app-promo
- Background: Semi-transparent gradient
- Border-radius: 20px
- Padding: 3rem
- Border: 2px dashed gold
- Text-align: center
- Margin: 2rem 0

.app-promo-icon
- Font-size: 60px
- Margin-bottom: 1rem

.app-promo h3
- Color: Gold
- Margin-bottom: 0.5rem
- Font-size: 1.5rem

.app-promo p
- Color: Semi-transparent white
- Margin-bottom: 1.5rem

.app-buttons
- Display: flex
- Gap: 1rem
- Justify-content: center
- Flex-wrap: wrap

.app-btn
- Background: Gold
- Color: White
- Padding: 0.8rem 2rem
- Border-radius: 20px
- Border: None
- Cursor: pointer
- Font-weight: 600
- Transition: all 0.3s
- Display: flex
- Align-items: center
- Gap: 0.5rem
- Hover: translateY(-3px)
- Hover: Gold glow box-shadow
```

### Chat Badge
```css
.chat-badge
- Position: fixed
- Bottom: 80px
- Right: 30px
- Background: Green (#27ae60)
- Color: White
- Padding: 0.5rem 0.8rem
- Border-radius: 20px
- Font-size: 0.8rem
- Font-weight: 600
- Animation: slideInRight 0.5s
- z-index: 999
```

## Animations

### @keyframes pulse
```css
0%, 100%: box-shadow: 0 0 0 0 rgba(39, 174, 96, 0.7)
50%: box-shadow: 0 0 0 8px rgba(39, 174, 96, 0)
```

### @keyframes slideInRight
```css
from:
  opacity: 0
  transform: translateX(20px)
  
to:
  opacity: 1
  transform: translateX(0)
```

## Color Palette

- **Primary Gold**: #c9a96e
- **Dark**: #1a1a1a
- **Darker**: #0f0f0f
- **Light**: #f5f5f5
- **Glass**: rgba(255, 255, 255, 0.1)
- **Success Green**: #27ae60
- **Alert Red**: #e74c3c
- **Warning Orange**: #f39c12

## Responsive Breakpoints

### Mobile (< 480px)
- Reduced font sizes
- Adjusted padding
- Stack layouts vertically

### Tablet (480px - 900px)
- Hidden nav links (menu toggled)
- Adjusted grid columns
- Responsive images

### Desktop (> 900px)
- Full navigation visible
- Multi-column grids
- Full feature display

## Light Mode Adjustments

When `body.light-mode` is active:
```css
- Background: #f5f5f5 to #e8e8e8 gradient
- Text Color: #1a1a1a
- Nav Background: rgba(255, 255, 255, 0.95)
- Nav Shadow: 0 2px 20px rgba(0, 0, 0, 0.1)
- Section Background: rgba(255, 255, 255, 0.9)
```

## Utility Classes

- `.show` - Display toggle for modals/toasts
- `.active` - Active state for elements
- `.completed` - Completed state for tracking
- `.error` - Error state for form fields
- `.badge` - Notification badge style

---

**All CSS classes are modern, responsive, and follow best practices!**
