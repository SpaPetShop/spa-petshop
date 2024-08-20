import { Box, IconButton } from "@mui/material";
import React from "react";
import ContactInfo from "../../components/common/contact/ContactInfo";
import ContactForm from "../../components/common/contact/ConactForm";
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';

const ContactPage = () => {
  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  return (
    <Box> 
      <Box sx={{ width: "85%", m: "auto" }}>
        <ContactInfo />
        <ContactForm />
      </Box>
      <Box sx={{ mt: 12, display:"flex", justifyContent:"center"}}>
        <iframe
          title="google_map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.5236503473357!2d114.21604661439115!3d24.33384814732132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x340406b77660041b%3A0x1e1faa9bb38e36f3!2s121%20Clear%20Water%20Bay%20Rd%2C%20Ngau%20Chi%20Wan%2C%20Hong%20Kong!5e0!3m2!1sen!2s!4v1652616952643!5m2!1sen!2s"
          width="99%"
          height="456"
        ></iframe>
      </Box>
      <IconButton aria-label="delete" size="large" sx={{position:"fixed", bottom:5, right:5}} onClick={handleScrollToTop}>
        <ArrowCircleUpIcon fontSize="inherit" color="success"/>
      </IconButton>
    </Box>
  );
}

export default ContactPage;
