import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px", navigate }) => {
  return (
    <Box width={size} height={size}>
      <img
        src={image}
        alt="user"
        style={{ objectFit: "cover", borderRadius: "50%", cursor: "pointer" }}
        width={size}
        height={size}
        onClick={navigate}
      />
    </Box>
  );
};

export default UserImage;
