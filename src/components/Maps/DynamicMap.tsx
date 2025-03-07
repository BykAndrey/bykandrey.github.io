// 'use client';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { useEffect, useRef, useState } from 'react';
// import st from './Map.module.scss';
// import './Map.scss';
// // import GeoJson from 'geojson';
// // import statistics from './statistics.json';
// import xmlData from './data.json';
// const statistics = xmlData.Root.data.record.reduce((acc, record) => {
//   const name = record.field.find((f) => f._name === 'Country or Area')?._key;
//   const year = +record.field.find((f) => f._name === 'Year')?.__text;
//   const value = +record.field.find((f) => f._name === 'Value')?.__text;

//   if (!name) return acc;
//   let dt = {
//     year: year,
//     value: value,
//   };
//   return {
//     ...acc,
//     [name]: acc[name] ? [...acc[name], dt] : [dt],
//   };
// }, {});
// console.log('statistics', statistics);
// function loadBorders() {
//   return fetch(`http://localhost:3001/load/World`).then((res) => res.json());
// }

// const getPolygonGeoJson = (cords, name) => {
//   return {
//     type: 'Feature',
//     geometry: {
//       type: 'Polygon',
//       coordinates: cords,
//     },
//     properties: {
//       name_en: name,
//     },
//     //...
//   };
// };

// const convertMultyPolygonToPolygon = (geoJsonObject) => {
//   if (geoJsonObject.geometry.type === 'MultiPolygon') {
//     return geoJsonObject.geometry.coordinates.map((cords) => {
//       return getPolygonGeoJson(cords, 'test');
//     });
//   } else {
//     return [geoJsonObject];
//   }
// };

// export default function DynamicMap() {
//   const mapRef = useRef<L.Map>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [curretnYear, setYear] = useState(2000);
//   const [mapData, setMapData] = useState(null);
//   useEffect(() => {
//     if (!containerRef.current) return;
//     console.log(window);
//     if (window === undefined) return;
//     let isMounted = true;
//     console.log(L);
//     const map = L.map(containerRef.current, {
//       zoom: 0,
//       center: [0, 0],
//       worldCopyJump: true,
//       zoomSnap: 0,
//     });
//     // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     //     maxZoom: 19,
//     //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//     // }).addTo(map);

//     mapRef.current = map;
//     // map.zoomSnap = 0

//     // let myIcon = L.divIcon({
//     //     html: '<div> Ukraine </div>',
//     //   className: 'my-div-icon',
//     //   iconAnchor: [50, 20],
//     // });
//     // you can set .my-div-icon styles in CSS

//     // L.marker([50.505, 30.57], { icon: myIcon }).addTo(map);

//     return () => {
//       map.remove();
//       isMounted = false;
//     };
//   }, []);

//   useEffect(() => {
//     loadBorders().then((data) => {
//       setMapData(data)
//     });
//   }, [])
//   useEffect(() => {
//     const map = mapRef.current;
//     if (!map || !mapData) return; 
//     map.eachLayer(function (layer) {
//       map.removeLayer(layer);
//   });

//       if (true) {
//         const scale = (v, min, max) => {
//           return (min / max + (100 * v) / max) / 100;
//         };
//         const max = Object.values(statistics).reduce((acc, c) => {
//           const dataOfYear = c.find((d) => d.year === curretnYear).value;
//           return acc > dataOfYear ? acc : dataOfYear;
//         }, 0);
//         console.log(max);
//         // console.log(data, map);
//         // data.features.forEach(v => {
//         //     L.geoJSON(v).addTo(map);
//         //     const  myIcon = L.divIcon({
//         //         html: `<div> ${v.properties['name_en']}</div>`,
//         //       className: 'my-div-icon',
//         //       iconAnchor: [50, 20],
//         //     });
//         //     // you can set .my-div-icon styles in CSS

//         //     L.marker([50.505, 30.57], { icon: myIcon }).addTo(map);
//         // });
//         // L.geoJSON(data).addTo(map);
//         // const globalMap = L.geoJSON(data);

//         const globalMap = L.geoJson(mapData, {
//           style: {
//             stroke: true,
//             weight: 0.1,
//           },
//           onEachFeature: function (feature, layer: L.Layer) {
//             // if (feature.properties['name_en'].toLowerCase().indexOf('russia') === -1) return;
//             // if (feature.geometry.type === 'MultiPolygon') {
//             if (!layer) return;
//             layer.addTo(map);
//             const countryParts = convertMultyPolygonToPolygon(feature).map(
//               (f) => {
//                 if (!f) return;
//                 const name = feature.properties['name_en'];
//                 const countryCode = feature.properties['iso_a3'];
//                 const info = statistics[countryCode]?.find(
//                   (data) => data.year === curretnYear
//                 );
//                 const percents = info ? scale(info.value, 0, max) * 100 : 0;
//                 //   const opacityValue = (info ? scale(info.value, 0, max) : 0.001)
//                 const opacity =
//                   percents > 50 ? percents / 50 - 1 : 1 - percents / 50;
//                 //   console.log('opacity', opacity)
//                 // const goodColor = 'rgba(0, 255, 125, 1)';
//                 const goodColor = info ? 'rgb(0, 153, 255)' : 'black';
//                 const countryPart = L.geoJSON(f, {
//                   style: {
//                     stroke: true,
//                     weight: opacity,
//                     fillOpacity: opacity,
//                     color: percents > 50 ? 'rgba(255, 35, 0, 1)' : goodColor,
//                     //   strokeColor:' red',
//                     fillColor:
//                       percents > 50 ? 'rgba(255, 35, 0, 1)' : goodColor,
//                   },
//                 }).addTo(map);
//                 //   countryPart.interactive = false
//                 //   return countryPart;
//                 const center = countryPart.getBounds().getCenter(); //the polygon's center
//                 const tooltip = L.tooltip({
//                   permanent: false, // Show only on hover
//                   direction: 'center', // Keep text centered
//                   className: 'polygon-tooltip', // Custom class for styling
//                 })
//                   .setLatLng(center)
//                   .setContent(
//                     info
//                       ? `<span>${name}</span> - <span>${info?.value} - ${percents}</span>`
//                       : name
//                   );

//                 countryPart.on('mouseover', (event) => {
//                   map.openTooltip(tooltip);
//                   countryParts.forEach((countryPart) => {
//                     countryPart.setStyle({
//                       fillOpacity: 0.5,
//                     });
//                   });
//                 });
//                 countryPart.on('mouseout', (event) => {
//                   map.closeTooltip(tooltip);

//                   countryParts.forEach((countryPart) => {
//                     countryPart.setStyle({
//                       fillOpacity: opacity,
//                     });
//                   });
//                 });
//                 return countryPart;
//               }
//             );
//           },
//         });

//         map.fitBounds(globalMap.getBounds());
//       }
 

//   }, [curretnYear, mapData])
//   return (
//     <div className={st.map}>
//       <input
//         type="number"
//         defaultValue={curretnYear}
//         onChange={(event) => setYear(+event.target.value)}
//       />
//       <div
//         className={st['map-container']}
//         ref={containerRef}
//         style={{
//           height: '100vh',
//         }}
//       ></div>
//     </div>
//   );
// }
