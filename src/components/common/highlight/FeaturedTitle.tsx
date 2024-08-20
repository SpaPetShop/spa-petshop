import React from 'react';
import './FeaturedTitle.css';
import decorateImage from '../../../assets/images/home/tieude_giua.png';

type FeaturedTitleProps = {
  title: string;
  subtitle?: string;
};

const FeaturedTitle: React.FC<FeaturedTitleProps> = ({title, subtitle}) => (
  <div className="feature-title-container">
    <h2 className="feature-title">{title}</h2>
    <img src={decorateImage} alt="decorate" className="feature-title-decorate" />
    <p className="feature-subtitle">{subtitle}</p>
  </div>
);

export default FeaturedTitle;