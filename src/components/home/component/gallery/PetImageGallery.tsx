import React from 'react';
import './PetImageGallery.css';
import gallery1 from '../../../../assets/images/home/gallery-1.jpg';
import gallery2 from '../../../../assets/images/home/gallery-2.jpg';
import gallery3 from '../../../../assets/images/home/gallery-3.jpg';
import gallery4 from '../../../../assets/images/home/gallery-4.jpg';
import gallery5 from '../../../../assets/images/home/gallery-5.jpg';
import gallery6 from '../../../../assets/images/home/gallery-6.jpg';

const images = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6
];

const PetImageGallery: React.FC = () => (
  <div className="gallery-container">
    {images.map((image, index) => (
      <div key={index} className="gallery-item">
        <img src={image} alt={`Pet ${index + 1}`} />
      </div>
    ))}
  </div>
);

export default PetImageGallery;
