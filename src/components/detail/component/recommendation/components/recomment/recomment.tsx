import React, { useState } from "react";
import "./recomment.css";
import { Link } from "react-router-dom";
import data from "../../../../../../assets/data/detail/recomment.json";

interface PetService {
  type: string;
  name: string;
  image: string;
  price: string;
  duration: string;
  rate: string;
  availability: string;
}

const Recomment: React.FC = () => {
  const { pets } = data;
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(pets.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentItems = pets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="recomment-container">
        {currentItems.map((pet: PetService, index: number) => (
          <div key={index} className="recomment-group">
            <div className="recomment-card recomment-image-container">
              <img src={pet.image} alt={pet.name} className="recomment-image" />
              <div className="recomment-buttons">
                <Link to="/detail" className="recomment-button">
                  Xem chi tiết
                </Link>
                <Link to="/booking" className="recomment-button">
                  Đặt lịch ngay
                </Link>
              </div>
            </div>
            <div className="recomment-info">
              <h3 className="recomment-name">{pet.name}</h3>
              <p>
                <span className="recomment-highlight">{pet.price}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`pagination-button ${
              currentPage === index + 1 ? "active" : ""
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Recomment;
