# Problems during development

- Prefetching Map tiles is super slow. We need to find solution to somehow cache them.
    - Solved: If hw acceleration is on, the map has no problem to render faster.


- HitTest stopped giving correct results, again getting warning about not GeoJson not having correct fields.
  - Solved: HitTest was updated on ArcGis - they renamed fields so destructing an object was not working anymore.

- Map gets re-rendered on touch on mobile devices, on desktop theres no issue. 