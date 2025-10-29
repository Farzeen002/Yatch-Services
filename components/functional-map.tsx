// "use client"

// import { useEffect, useRef, useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { MapPin, Navigation, Clock, Phone } from "lucide-react"

// interface FunctionalMapProps {
//   yachtLocation: string
//   yachtName: string
//   className?: string
// }

// export default function FunctionalMap({ yachtLocation, yachtName, className = "" }: FunctionalMapProps) {
//   const mapRef = useRef<HTMLDivElement>(null)
//   const [mapLoaded, setMapLoaded] = useState(false)
//   const [mapError, setMapError] = useState(false)

//   useEffect(() => {
//     // Load Google Maps script
//     const loadGoogleMaps = () => {
//       if (window.google && window.google.maps) {
//         initializeMap()
//         return
//       }

//       const script = document.createElement('script')
//       script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=places`
//       script.async = true
//       script.defer = true
//       script.onload = () => {
//         setMapLoaded(true)
//         initializeMap()
//       }
//       script.onerror = () => {
//         setMapError(true)
//       }
//       document.head.appendChild(script)
//     }

//     const initializeMap = () => {
//       if (!mapRef.current || !window.google) return

//       // Geocode the yacht location
//       const geocoder = new window.google.maps.Geocoder()
//       geocoder.geocode({ address: yachtLocation }, (results, status) => {
//         if (status === 'OK' && results && results[0]) {
//           const location = results[0].geometry.location
          
//           const map = new window.google.maps.Map(mapRef.current, {
//             zoom: 15,
//             center: location,
//             mapTypeId: window.google.maps.MapTypeId.HYBRID,
//             styles: [
//               {
//                 featureType: "water",
//                 elementType: "geometry",
//                 stylers: [{ color: "#46bcec" }, { visibility: "on" }]
//               },
//               {
//                 featureType: "landscape",
//                 elementType: "geometry.fill",
//                 stylers: [{ color: "#f2f2f2" }]
//               }
//             ]
//           })

//           // Add marker
//           new window.google.maps.Marker({
//             position: location,
//             map: map,
//             title: yachtName,
//             icon: {
//               url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
//                 <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
//                   <circle cx="20" cy="20" r="18" fill="#2563eb" stroke="#ffffff" stroke-width="4"/>
//                   <path d="M20 8 L24 16 L32 16 L26 22 L28 30 L20 24 L12 30 L14 22 L8 16 L16 16 Z" fill="#ffffff"/>
//                 </svg>
//               `),
//               scaledSize: new window.google.maps.Size(40, 40),
//               anchor: new window.google.maps.Point(20, 20)
//             }
//           })

//           // Add info window
//           const infoWindow = new window.google.maps.InfoWindow({
//             content: `
//               <div style="padding: 10px; max-width: 200px;">
//                 <h3 style="margin: 0 0 8px 0; color: #1f2937; font-weight: 600;">${yachtName}</h3>
//                 <p style="margin: 0; color: #6b7280; font-size: 14px;">${yachtLocation}</p>
//                 <div style="margin-top: 8px;">
//                   <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(yachtLocation)}', '_blank')" 
//                           style="background: #2563eb; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
//                     Get Directions
//                   </button>
//                 </div>
//               </div>
//             `
//           })

//           // Add click listener to marker
//           const marker = new window.google.maps.Marker({
//             position: location,
//             map: map,
//             title: yachtName
//           })

//           marker.addListener('click', () => {
//             infoWindow.open(map, marker)
//           })
//         } else {
//           setMapError(true)
//         }
//       })
//     }

//     loadGoogleMaps()
//   }, [yachtLocation, yachtName])

//   if (mapError) {
//     return (
//       <Card className={className}>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <MapPin className="h-5 w-5" />
//             Yacht Location
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="bg-gray-100 rounded-lg p-8 text-center">
//             <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-600 mb-2">Map unavailable</p>
//             <p className="text-sm text-gray-500">{yachtLocation}</p>
//             <a 
//               href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(yachtLocation)}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               <Navigation className="h-4 w-4" />
//               View on Google Maps
//             </a>
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <Card className={className}>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <MapPin className="h-5 w-5" />
//           Yacht Location
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {/* Map Container */}
//           <div 
//             ref={mapRef}
//             className="w-full h-64 rounded-lg overflow-hidden border border-gray-200"
//             style={{ minHeight: '256px' }}
//           >
//             {!mapLoaded && (
//               <div className="flex items-center justify-center h-full bg-gray-100">
//                 <div className="text-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
//                   <p className="text-gray-600">Loading map...</p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Location Details */}
//           <div className="space-y-3">
//             <div className="flex items-start gap-3">
//               <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
//               <div>
//                 <p className="font-medium text-gray-900">{yachtName}</p>
//                 <p className="text-sm text-gray-600">{yachtLocation}</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <Clock className="h-5 w-5 text-gray-400" />
//               <div>
//                 <p className="text-sm font-medium text-gray-900">Marina Hours</p>
//                 <p className="text-sm text-gray-600">24/7 Access</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <Phone className="h-5 w-5 text-gray-400" />
//               <div>
//                 <p className="text-sm font-medium text-gray-900">Marina Contact</p>
//                 <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
//               </div>
//             </div>

//             <div className="pt-2">
//               <a 
//                 href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(yachtLocation)}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
//               >
//                 <Navigation className="h-4 w-4" />
//                 Get Directions
//               </a>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }




