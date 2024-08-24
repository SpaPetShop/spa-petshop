import React from "react";
import "./Footer.css";
import addressImage from "../../../assets/images/footer/diachi.png";
import phoneImage from "../../../assets/images/footer/phone.png";
import emailImage from "../../../assets/images/footer/email.png";
import clockImage from "../../../assets/images/footer/clock.png";
import logoImage from "../../../assets/images/footer/logo-large.png";

const Footer: React.FC = () => (
  <div className="footer-container">
    <div className="footer-section footer-logo">
      <img src={logoImage} alt="Pet Care Logo" />
    </div>
    <div className="footer-section">
      <h3>Thông tin liên hệ</h3>
      <div className="footer-item">
        <img src={addressImage} alt="Address" />
        <p>
          14.14 Đường số 6, KĐT Hà Quang 2, P. Phước Hải, TP. Nha Trang
        </p>
      </div>
      <div className="footer-item">
        <img src={phoneImage} alt="Hotline" />
        <p>0258 381 2078 hoặc 0258 381 2077</p>
      </div>
      <div className="footer-item">
        <img src={emailImage} alt="Email" />
        <p>Master_FE_HaThanhDat@gmail.com</p>
      </div>
      <div className="footer-item">
        <img src={clockImage} alt="Opening Hours" />
        <p>Từ thứ 2 đến chủ nhật (8:am - 10:00pm)</p>
      </div>
      <p className="footer-bottom-text">© 2024 Pet Care. All rights reserved.</p>
    </div>
  </div>
);

export default Footer;
