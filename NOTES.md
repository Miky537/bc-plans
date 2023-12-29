# Problems during development

- Prefetching Map tiles is super slow. We need to find solution to somehow cache them.
    - Solved: If hw acceleration is on, the map has no problem to render faster.


- HitTest stopped giving correct results, again getting warning about not GeoJson not having correct fields.
  - Solved: HitTest was updated on ArcGis - they renamed fields so destructing an object was not working anymore.

- .graphic is unresolved variable even though in browser console there clearly is a graphic object.
  - Solved: It was a problem with typescript, there were multiple types returned after HitTest, so I had to iterate
    though the results
---
### - **Map gets re-rendered on touch on mobile devices, on desktop theres no issue**. 
   - Different basemap - didnt work
   - Dependencies checked - didnt work
   - Displaying only map and nothing else - didnt work
   - Disabled all default behavior - didnt work
- #### Map gets re-rendered only on android devices 
  - probably issue with Arcgis map. Asked about it on esri forum and waiting for results.
  - [Link to forum](https://community.esri.com/t5/arcgis-javascript-maps-sdk-questions/map-view-re-render-on-click-on-android/m-p/1364075#M83196)
  - On very new android devices it works fine, but on older ones it still re-renders.

---
- Data from jsons and current ones in original json are different, including id of the room.