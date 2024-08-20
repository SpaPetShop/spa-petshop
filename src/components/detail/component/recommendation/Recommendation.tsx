import React from "react";
import "./Recommendation.css";
import FeaturedTitle from "../../../common/highlight/FeaturedTitle";
import Recomment from "./components/recomment/recomment";

const Recommendation: React.FC = () => (
  <div className="recommendation">
    <FeaturedTitle title={'CÁC DỊCH VỤ KHÁC'}/>
    <div className="recommendation-items">
      <Recomment />
    </div>
  </div>
);

export default Recommendation;
