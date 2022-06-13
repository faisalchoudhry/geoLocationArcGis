import React, {useEffect} from "react";
import ReactDOM from "react-dom";
import {Map} from "@esri/react-arcgis";
import {loadModules} from "esri-loader";
import axios from "axios";

import "./styles.css";

const rootElement = document.getElementById("root");

const App = () => {

    let resultSearchWidget = '';
    const mapLoad = function (map, view) {
        loadModules(["esri/widgets/Search"]).then(([Search]) => {
            const searchWidget = new Search({
                view: view,
                container: "searchWidget",
                popupEnabled: false
            });
            searchWidget.on('search-complete', function(result){
                resultSearchWidget = result;
                console.log(resultSearchWidget.searchTerm)
                f(resultSearchWidget.searchTerm);
            });

            view.ui.add(searchWidget, {
                position: "top-right"
            });
        });
    };

    const f = (resultSearchWidget)=>{
        axios.get('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?', {
            params: {
                SingleLine: resultSearchWidget,
                category: '',
                outFields: '*',
                forStorage: false,
                f: 'pjson'
            }
        }).then(response => {
            console.log(response.data);
            // this.setState({isLoaded: true, items: response.data, flag: 1})
            // alert(response);
        }).catch(error => {
            alert("error");
        })
    }

    return (
        <Map
            mapProperties={{basemap: "streets-vector"}}
            viewProperties={{center: [-90, 38]}}
            loaderOptions={{version: "4.17", css: true}}
            onLoad={mapLoad}
        />
    );
};

ReactDOM.render(<App/>, rootElement);
