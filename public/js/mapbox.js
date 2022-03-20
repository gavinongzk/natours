
export const displayMap = locations => {


    mapboxgl.accessToken = 'pk.eyJ1IjoiZG9vbXgiLCJhIjoiY2wwa3p6c3VuMHJneDNpbTk5ODZvaGk2ZiJ9.yGNdC3R_2Qirwyw1u5zKeg';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        scrollZoom: false,
        animate: false
    
    });
    
    const bounds = new mapboxgl.LngLatBounds();
    
    locations.forEach(loc => {
        // Creates a marker
        const el = document.createElement('div');
        el.className = "marker";
    
        // Add marker
        new mapboxgl.Marker({
            element: el,
            anchor: "bottom"
        })
            .setLngLat(loc.coordinates)
            .addTo(map);
    
        // Add popup
        new mapboxgl.Popup({
            offset: 30,
            focusAfterOpen: false
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);
        // Extend mapbounds to include current location
        bounds.extend(loc.coordinates)});
    
    const fitBoundsOptions = {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        },
        linear: true,
        duration: 0
    }

    map.fitBounds(bounds, fitBoundsOptions);

}

