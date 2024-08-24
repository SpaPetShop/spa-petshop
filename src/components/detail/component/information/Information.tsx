import React, { useState, useEffect } from "react";
import "./Information.css";
import detailData from "../../../../assets/data/detail/index.json";
import { ProductType } from "../../../../types/Product/ProductType";

interface InformationProps {
  product: ProductType | null;
}

const Information: React.FC<InformationProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState("detail");
  const [detail, setDetail] = useState<any>(null);

  useEffect(() => {
    // Load the detail data from the JSON file
    const detailInfo = detailData.data.find((item) => item.id === "1");
    setDetail(detailInfo);
  }, []);

  return (
    <div className="information">
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "detail" ? "active" : ""}`}
          onClick={() => setActiveTab("detail")}
        >
          Thông tin chi tiết
        </button>
      </div>

      {activeTab === "detail" && detail && (
        <div className="tab-content">
          {/* Hiển thị thông tin chi tiết sản phẩm */}
          {/* <div dangerouslySetInnerHTML={{ __html: detail.html }} /> */}
        </div>
      )}
    </div>
  );
};

export default Information;
