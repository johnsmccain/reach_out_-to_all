# Image Bank

Centralized image management for the Reachout To All application.

## Usage

### Import Specific Images

```typescript
// Import specific images by name
import { reachout, pastorbawa, img1, img2 } from '@/asset/imageBank';

// Use in your component
<img src={reachout} alt="Reachout" />
<img src={img1} alt="Gallery Image 1" />
```

### Import Default Object

```typescript
// Import the default object with all images organized
import imageBank from '@/asset/imageBank';

// Access by category
<img src={imageBank.main.reachout} alt="Reachout" />
<img src={imageBank.main.pastorbawa} alt="Pastor Bawa" />

// Access R2A series
<img src={imageBank.r2a.r2a1} alt="R2A 1" />

// Access gallery array
{imageBank.gallery.map((img, index) => (
  <img key={index} src={img} alt={`Gallery ${index + 1}`} />
))}
```

### Helper Functions

```typescript
import imageBank from '@/asset/imageBank';

// Get a random image
const randomImage = imageBank.getRandom();

// Get multiple random images
const randomImages = imageBank.getRandom(5);

// Get all images as array
const allImages = imageBank.getAll();
```

## Image Categories

### Main Images
- `reachout` - Main logo/banner image
- `pastorbawa` - Pastor Bawa image

### R2A Series
- `r2a1`, `r2a2`, `r2a3`, `r2a4` - R2A event images

### General Images
- `image1`, `image2`, `image22`, `image222`, `image23`

### Gallery (img-1 to img-65)
- 65 numbered images for galleries, carousels, etc.
- Access via `img1` through `img65`

### JPEG Series
- `img3jpeg` through `img11jpeg` - Alternative JPEG versions

## Examples

### Image Gallery Component

```typescript
import imageBank from '@/asset/imageBank';

const Gallery = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {imageBank.gallery.slice(0, 9).map((img, index) => (
        <img 
          key={index} 
          src={img} 
          alt={`Gallery ${index + 1}`}
          className="w-full h-48 object-cover rounded-lg"
        />
      ))}
    </div>
  );
};
```

### Random Hero Image

```typescript
import { useEffect, useState } from 'react';
import imageBank from '@/asset/imageBank';

const Hero = () => {
  const [heroImage, setHeroImage] = useState(imageBank.getRandom());
  
  useEffect(() => {
    // Change image every 5 seconds
    const interval = setInterval(() => {
      setHeroImage(imageBank.getRandom());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return <img src={heroImage} alt="Hero" />;
};
```

### Carousel with Specific Images

```typescript
import { img1, img2, img3, img4, img5 } from '@/asset/imageBank';

const carouselImages = [img1, img2, img3, img4, img5];

const Carousel = () => {
  return (
    <div className="carousel">
      {carouselImages.map((img, index) => (
        <img key={index} src={img} alt={`Slide ${index + 1}`} />
      ))}
    </div>
  );
};
```

## Benefits

✅ **Centralized Management** - All images in one place  
✅ **Type Safety** - TypeScript support for all imports  
✅ **Easy Refactoring** - Change image paths in one location  
✅ **Helper Functions** - Built-in utilities for common tasks  
✅ **Organized Structure** - Images grouped by category  
✅ **Performance** - Vite optimizes imports automatically
