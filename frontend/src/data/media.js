import image4 from '../assets/products/image-4.png';
import image6 from '../assets/products/image-6.png';
import image7 from '../assets/products/image-7.png';
import image9 from '../assets/products/image-9.png';
import image10 from '../assets/products/image-10.png';
import avatar1 from '../assets/people/avatar-1.png';
import avatar2 from '../assets/people/avatar-2.png';
import newsletterMan from '../assets/people/newsletter-man.png';
import newsletterSpark from '../assets/decor/newsletter-spark.png';

export const productImageMap = {
  'image-4': image4,
  'image-6': image6,
  'image-7': image7,
  'image-9': image9,
  'image-10': image10,
};

export const testimonialImageMap = {
  'Михеев Даниэль': avatar1,
  'Короткова София': avatar2,
};

export const newsletterImages = {
  man: newsletterMan,
  spark: newsletterSpark,
};

export function enrichProduct(product) {
  return {
    ...product,
    imageSrc: product.imageKey ? productImageMap[product.imageKey] : '',
  };
}

export function enrichProducts(products) {
  return products.map(enrichProduct);
}

export function enrichTestimonials(testimonials) {
  return testimonials.map((item) => ({
    ...item,
    avatarSrc: testimonialImageMap[item.name] || '',
  }));
}
