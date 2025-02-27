import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import PropType from 'prop-types'; 
import '../index.css'

export default function CircularIndeterminate({ type = "light" }) {
  return (
    <Box  style={{}}
     sx={{background: "var(--background-color)",
width:"100%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center",...type}} className={type}>
      <CircularProgress />
    </Box>
  );
}

CircularIndeterminate.propTypes = {
  type: PropType.object
}