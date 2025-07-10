# Mobile Testing Checklist

## ✅ Test These Features on Mobile:

### 1. **Viewport & Responsive Design**

- [ ] App fills the entire screen width
- [ ] No horizontal scrolling
- [ ] Text is readable without zooming
- [ ] Touch targets are at least 44px (thumb-friendly)

### 2. **Chat Interface**

- [ ] Messages display properly on small screens
- [ ] Text wraps correctly
- [ ] Timestamps are visible
- [ ] Scroll works smoothly

### 3. **Touch Interactions**

- [ ] All elements are touchable
- [ ] No tiny buttons or links
- [ ] Smooth scrolling in chat area
- [ ] No accidental taps

### 4. **Performance**

- [ ] App loads quickly on mobile data
- [ ] Smooth animations
- [ ] No lag when scrolling
- [ ] Battery usage is reasonable

### 5. **Orientation**

- [ ] Works in portrait mode
- [ ] Works in landscape mode
- [ ] No layout breaks when rotating

## 🧪 Quick Test Commands

```bash
# Test on different screen sizes
curl -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" http://localhost:3000

# Check if viewport meta tag is present
curl -s http://localhost:3000 | grep -i viewport
```

## 📱 Mobile-Specific Features to Test

1. **Safari/Chrome Mobile**: Test scrolling and touch
2. **Different screen sizes**: iPhone SE, iPhone 12, iPad
3. **Network conditions**: Slow 3G, Fast 3G
4. **Orientation changes**: Portrait ↔ Landscape
