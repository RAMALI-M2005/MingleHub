import { Box, Skeleton, Grid } from '@mui/material';

const AuthImagePattern = () => {
  return (
    <Grid 
      container 
      spacing={1} 
      display={{ xs: 'none', md: 'flex' }} 
      justifyContent="center"
      alignContent="center"
        sx={{width: '330px'}}
    >
      {Array.from(new Array(9)).map((_, index) => (
        <Grid item xs={4} key={index}>
          <Box 
            sx={{ 
              width: 100, 
              height: 100, 
              borderRadius: '6px', 
              overflow: 'hidden',
            }}
          >
            <Skeleton variant="rectangular" width="100%" height="100%" animation="wave"/>
          </Box>
        </Grid>
      ))}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h3 style={{margin:"10px 0"}}>Join our community</h3>
        <p style={{fontSize:".7rem",lineHeight:"1.6",color:"var(--secondary-text-color) !important"}}>Connect with friends, share moments, and stay in touch with your loved ones.</p>
      </div>
    </Grid>
  );
};

export default AuthImagePattern;
