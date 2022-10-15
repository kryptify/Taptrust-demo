import { Outlet } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { AppBar, Box, Container } from "@mui/material";
import Navbar from "./Navbar";

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

export default function MainLayout() {
  return (
    <Box>
      <Navbar />
      <div className="text-center selection:bg-green-900">
        <Offset />
        <Container maxWidth={false} sx={{ marginBottom: 5 }}>
          <Outlet />
        </Container>
      </div>
    </Box>
  );
}
