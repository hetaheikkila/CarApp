//import 'components./CarList.jsx'
import { AppBar, Toolbar, Typography } from "@mui/material"
import CarList from './components/CarList.jsx';


function App() {

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Car App</Typography>
        </Toolbar>
      </AppBar>
      <CarList />
    </>
  )
}

export default App
