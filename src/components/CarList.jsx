import { Button, Snackbar } from "@mui/base";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react"
import AddCar from "./AddCar";
import EditCar from "./EditCar";

export default function CarList() {

    //states
    const [cars, setCars] = useState([{ brand: '', model: '' }]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [msgSnackbar, setMsgSnackbar] = useState("");

    const columns = [
        { HeaderName: 'Brand', field: 'brand', sortable: true, filter:true},
        { HeaderName: 'Model', field: 'model', sortable: true, filter:true},
        { HeaderName: 'Fuel', field: 'fuel', sortable: true, filter:true},
        { HeaderName: 'Year', field: 'year', sortable: true, filter:true},
        { HeaderName: 'Color', field: 'color', sortable: true, filter:true},
        { HeaderName: 'Price', field: 'price', sortable: true, filter:true},
        {cellRenderer: params => <EditCar updateCar={updateCar} params={params}/>, width: 120}];
       
    

            cellRenderer: (params) =>
                <Button
                    size="small"
                    color="error"
                    onClick={() => deleteCar(params)}
                >Delete
                </Button>;

    //useEffect
    useEffect(() => getCars(), []); //fetch only

    //functions
    //getCars
    const getCars = () => {
        fetch("https://carrestservice-carshop.rahtiapp.fi/cars")
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(responsedata => {
                console.log(responsedata._embedded.cars);
                setCars(responsedata._embedded.cars);
            })
            .catch(error => console.error(error))
    }

    //deleteCar

    const deleteCar = (params) => {
        console.log(params.data._links.car.href);
        if (window.confirm("Oletko varma?")) {
            fetch(params.data._links.car.href, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        setMsgSnackbar("Poistettu");
                        setOpenSnackbar(true);
                        getCars();
                    }
                    else {
                        window.alert("Joku meni vikaan.");
                    }
                })
                .catch(error => console.error(error));
        }
    }

    const addCar = (car) => {
        console.log("Carlist: addCar");
        fetch("https://carrestservice-carshop.rahtiapp.fi/cars", {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(car)
        })
            .then(response => {
                console.log("response " + response);
                if (response.ok) {
                    setMsg('Auton lisäys onnistui');
                    setOpenSnackbar(true);
                    return response.json;
                } else {
                    throw new Error('Datan vienti bäkkäriin ei onnistunut')
                }
            })
            .then(data => {
                console.log("Parsed Json =" + data);
                getCars()
            })
    }

    //return
    return (
        <>
            <AddCar addCar={AddCar} />
            <div className="ag-theme-material" style={{ width: 700, height: 500 }}>
                <AgGridReact
                    rowData={cars}
                    columnDefs={colDefs}
                    pagination={true}
                    paginationPageSize={10}
                >

                </AgGridReact>
                <Snackbar
                    open={openSnackbar}
                    message={msgSnackbar}
                    autoHideDuration={3000}
                    onClose={() => {
                        setOpenSnackbar(false);
                        message={Msg};
                    }}>
                </Snackbar>
            </div>
        </>
    )
}