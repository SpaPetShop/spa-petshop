import { Grid, Box } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import PetCard from "../../../components/home/component/card/PetCard";
import FeaturedTitle from "../../../components/common/highlight/FeaturedTitle";
import styles from "./Home.module.css"; // Import CSS Module
import SubProductAPI from "../../../utils/SubProductAPI";
import {
  FilterProductType,
  ProductType,
  ProductResponse,
} from "../../../types/Product/ProductType";
import { PaginationType } from "../../../types/CommonType";
import PetImageGallery from "../../../components/home/component/gallery/PetImageGallery";
import LoadingComponentVersion2 from "../../../components/common/loading/Backdrop";

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listProduct, setListProduct] = useState<ProductType[]>([]);
  const [filter, setFilter] = useState<FilterProductType>({
    page: 1,
    size: 1000,
    Status: "Available",
  });
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    size: 1000,
    total: 0,
    totalPages: 1,
  });

  const fetchAllProduct = useCallback(async () => {
    try {
      setIsLoading(true);
      const data: ProductResponse = await SubProductAPI.getAll(filter);
      setListProduct(data.items);
      setPagination({
        page: data.page,
        size: data.size,
        total: data.total,
        totalPages: data.totalPages,
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchAllProduct();
  }, [fetchAllProduct]);

  const defaultPetData = {
    image: [
      {
        imageURL:
          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      },
    ],
  };

  const renderProductGrid = (title: string, category: string) => (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <Grid container spacing={3}>
        {listProduct
          .filter((product) => product.category.name === category)
          .map((product) => (
            <PetCard
              key={product.id}
              pet={{
                id: product.id,
                name: product.name,
                stockPrice: product.stockPrice,
                sellingPrice: product.sellingPrice,
                status: product.status,
                category: product.category,
                image: product?.image?.[0]?.imageURL
                  ? product.image[0].imageURL
                  : defaultPetData.image[0].imageURL,
              }}
            />
          ))}
      </Grid>
    </section>
  );

  return (
    <div className={styles.container}>
      <LoadingComponentVersion2 open={isLoading} />
      <FeaturedTitle
        title="BOSS DỊCH VỤ"
        subtitle="Các loại dịch vụ chăm sóc cho thú cưng của bạn"
      />

      {renderProductGrid("Dịch vụ cho cún", "Chó")}
      {renderProductGrid("Dịch vụ cho mèo", "Mèo")}
      {renderProductGrid("Dịch vụ cho vẹt", "Vẹt")}
      {renderProductGrid("Dịch vụ cho thỏ", "Thỏ")}

      <FeaturedTitle
        title="KHOẢNH KHẮC THÚ CƯNG"
        subtitle="PET LIKE US AND SO WILL YOU"
      />
      <PetImageGallery />
    </div>
  );
};

export default Home;
