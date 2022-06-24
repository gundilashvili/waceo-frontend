import { Avatar,Card, CardContent, Grid, Typography } from '@mui/material';
import InsertChartIcon from '@mui/icons-material/InsertChartOutlined';
import Skeleton from "@mui/material/Skeleton";

export const WaceoTotalSupply = (props) => (
  <Card
    sx={{ height: '100%' }}
    {...props}
  >
    <CardContent>
     
        {props.value ? (
           <Grid
           container
           spacing={3}
           sx={{ justifyContent: 'space-between' }}
         >
            <Grid item>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="overline"
              >
                WACEO TOTAL SUPPLY
              </Typography>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                {props.value}
              </Typography>
            </Grid>
            <Grid item>
              <Avatar
                sx={{
                  backgroundColor: 'warning.main',
                  height: 56,
                  width: 56
                }}
              >
                <InsertChartIcon />
              </Avatar>
            </Grid>
          </Grid> 
       ): (
        <Grid
            container
            spacing={3}
            sx={{ justifyContent: 'space-between' }}
          >
          <Grid item xs={9} md={9}>
           <div  style={{marginTop:10}}>
              <Skeleton 
                animation="wave"
                height={16}
                width="80%"
                style={{ marginBottom: 6 }}
              />
              <Skeleton animation="wave" height={16} width="45%" />
            </div>
          </Grid>
          <Grid item xs={3} md={3}>
            <Skeleton 
              animation="wave"
              variant="circular"
              width={50}
              height={50}
            />
          </Grid> 
        </Grid>  
       )}  
    </CardContent>
  </Card>
);
