import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import styles from "./DetailPage.module.css"; // Import CSS Module
import Sidebar from "../../../components/detail/component/sidebar/Sidebar";
import Recommendation from "../../../components/detail/component/recommendation/Recommendation";
import MainContent from "../../../components/detail/component/content/MainContent";
import Information from "../../../components/detail/component/information/Information";
import { ProductType } from "../../../types/Product/ProductType";
import SubProductAPI from "../../../utils/SubProductAPI";
import LoadingComponentVersion2 from "../../../components/common/loading/Backdrop";

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract id from URL parameters
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<ProductType | null>(null);

  const defaultProductData: ProductType = {
    id: "N/A",
    name: "Sản phẩm không có sẵn",
    stockPrice: 0,
    sellingPrice: 0,
    description: "Mô tả sản phẩm không có sẵn.",
    status: "Unavailable",
    priority: null,
    category: {
      id: "N/A",
      name: "Chưa xác định",
    },
    image: [
      {
        imageURL:
          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      },
    ],
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const response = await SubProductAPI.getOne(id);
          const productData: any = response;

          // Set fallback data if some fields are missing
          const productWithDefaults = {
            ...defaultProductData,
            ...productData,
            category: {
              ...defaultProductData.category,
              ...productData.category,
            },
            image:
              productData.image.length > 0
                ? productData.image
                : defaultProductData.image,
          };

          setProduct(productWithDefaults);
        }
      } catch (error) {
        console.error("Failed to fetch product details", error);
        setProduct(defaultProductData); // Set default data in case of an error
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return (
    <Box className={styles.detailPage}>
      <LoadingComponentVersion2 open={isLoading} />
      <Box className={styles.sidebar}>
        <Sidebar />
      </Box>
      <Box className={styles.mainContentArea}>
        {isLoading ? (
          <Typography className={styles.loadingText}>Loading...</Typography>
        ) : (
          <>
            <MainContent product={product} />
            <Information product={product} />
            {/* <Recommendation /> */}
          </>
        )}
      </Box>
    </Box>
  );
};

export default DetailPage;
