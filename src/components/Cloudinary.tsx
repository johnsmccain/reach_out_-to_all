import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';

interface CloudinaryProps {
    image: string;
    width: number;
    height: number;
}
const CloudinaryComponent = ({image, width, height}: CloudinaryProps) =>  {
    const cld = new Cloudinary({ cloud: { cloudName: import.meta.env.VITE_CLOUDINARY_API_NAME } });
    
    // Use this sample image or upload your own via the Media Explorer
    const img = cld
          .image(image)
          .format('auto') // Optimize delivery by resizing and applying auto-format and auto-quality
          .quality('auto')
          .resize(auto().gravity(autoGravity()).width(width).height(height)); // Transform the image: auto-crop to square aspect_ratio
  
    return (<AdvancedImage cldImg={img}/>);
  };

export default CloudinaryComponent