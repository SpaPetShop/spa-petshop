  import React, { useCallback, useEffect, useState } from "react";
  import { useLocation, useNavigate } from "react-router-dom";
  import { Grid, Pagination } from "@mui/material";
  import { toast } from "react-toastify";
  import PetCard from "../../../components/home/component/card/PetCard";
  import FeaturedTitle from "../../../components/common/highlight/FeaturedTitle";
  import styles from "./Home.module.css"; // Import CSS Module
  import SubProductAPI from "../../../utils/SubProductAPI";// Import API
  import {
    FilterProductType,
    ProductType,
    ProductResponse,
  } from "../../../types/Product/ProductType";
  import { PaginationType } from "../../../types/CommonType";
  import PetImageGallery from "../../../components/home/component/gallery/PetImageGallery";
  import LoadingComponentVersion2 from "../../../components/common/loading/Backdrop";
  import BookingAPI from "../../../utils/BookingAPI"; // Add this if you need to update order status

  const Home: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [listProduct, setListProduct] = useState<ProductType[]>([]);
    const [filter, setFilter] = useState<FilterProductType>({
      page: 1,
      size: 8, // Update size to 8 to display only 8 items per page
      Status: "Available",
    });
    const [pagination, setPagination] = useState<PaginationType>({
      page: 1,
      size: 8,
      total: 0,
      totalPages: 1,
    });
    const navigate = useNavigate();
    const location = useLocation();

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

    useEffect(() => {
      // Parse URL parameters to get the response code
      const params = new URLSearchParams(location.search);
      const responseCode = params.get("vnp_ResponseCode");
      console.log(responseCode)

      if (responseCode) {
        if (responseCode === "00") {
          // Payment succeeded
          toast.success("Thanh toán thành công!");

          const orderId = localStorage.getItem("orderId");
          if (orderId) {
            // Optionally, update order status to PAID
            BookingAPI.updateOrderStatus(orderId, {
              status: "PAID",
            })
            .then(() => {
              navigate("/profile")
            })
            .catch((error) => {
              console.error("Failed to update order status:", error);
            });

            localStorage.removeItem("cart");
          }
        } else if(responseCode !== "00"){
          // Payment failed
          toast.error("Thanh toán thất bại. Vui lòng thử lại.");
        }
      } 
    }, [location]);

    const defaultPetData = {
      image: [
        {
          imageURL:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        },
      ],
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
      setFilter((prevFilter) => ({ ...prevFilter, page }));
    };

    useEffect(() => {
      fetchAllProduct();
    }, [filter.page]);

    const renderProductGrid = (title: string) => (
      <section className={styles.section}>
        <h2 className={styles.title}>{title}</h2>
        <Grid container spacing={3}>
          {listProduct.map((product) => (
            <PetCard
              key={product.id}
              pet={{
                id: product.id,
                name: product.name,
                stockPrice: product.stockPrice,
                sellingPrice: product.sellingPrice,
                timeWork: product.timeWork,
                status: product.status,
                category: product.category,
                image: product?.image?.[0]?.imageURL
                  ? product.image[0].imageURL
                  : defaultPetData.image[0].imageURL,
              }}
            />
          ))}
        </Grid>
        <div className={styles.pagination}>
          <Pagination
            count={pagination.totalPages}
            page={filter.page}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      </section>
    );

    return (
      <div className={styles.container}>
        <LoadingComponentVersion2 open={isLoading} />
        <FeaturedTitle
          title="BOSS DỊCH VỤ"
          subtitle="Các dịch vụ lẻ chăm sóc cho thú cưng của bạn"
        />

        {renderProductGrid(" ")}

        <FeaturedTitle
          title="KHOẢNH KHẮC THÚ CƯNG"
          subtitle="PET LIKE US AND SO WILL YOU"
        />
        <PetImageGallery />
      </div>
    );
  };

  export default Home;
