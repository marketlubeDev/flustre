# Button Component

A reusable, customizable button component with multiple variants, sizes, and states.

## Import

```jsx
import Button from './components/common/Button';
// or
import { Button } from './components/common';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Button content |
| `variant` | string | `'primary'` | Button style variant |
| `size` | string | `'medium'` | Button size |
| `type` | string | `'button'` | HTML button type |
| `disabled` | boolean | `false` | Disable the button |
| `loading` | boolean | `false` | Show loading spinner |
| `onClick` | function | - | Click handler |
| `className` | string | `''` | Additional CSS classes |

## Variants

- `primary` - Primary brand color (burgundy)
- `secondary` - Gray background
- `outline` - Outlined with primary color
- `danger` - Red background for destructive actions
- `success` - Green background for positive actions
- `warning` - Yellow background for caution
- `ghost` - Transparent background

## Sizes

- `small` - Compact size
- `medium` - Default size
- `large` - Larger size

## Examples

### Basic Usage

```jsx
<Button onClick={handleClick}>
  Click me
</Button>
```

### With Variants

```jsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="danger">Delete</Button>
<Button variant="success">Save</Button>
```

### With Sizes

```jsx
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>
```

### With States

```jsx
<Button disabled>Disabled</Button>
<Button loading>Loading...</Button>
```

### With Custom Styling

```jsx
<Button 
  variant="primary" 
  className="shadow-lg transform hover:scale-105"
  onClick={handleClick}
>
  Custom Styled
</Button>
```

## Styling

The component uses Tailwind CSS classes and follows the project's design system. The primary color is defined in the CSS variables (`--color-primary: #6D0D26`).

All buttons include:
- Hover effects
- Focus states with ring
- Disabled states
- Loading spinner animation
- Smooth transitions 