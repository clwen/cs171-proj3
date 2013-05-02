### CS171 Project 3: The Residential Footprint of MIT

#### About
* Authors: Chunglin Wen, Amy Yu (sorted by lastname)
* Please see `https://github.com/clwen/cs171-proj3` for a github flavored markdown version of the `README`

---

#### How to run the visualization

1. Run the Python SimpleHTTPServer under project directory
    * `python -m SimpleHTTPServer 8000`
2. Open `index.html` in browser with the URL `http://localhost:8000/index.html`

---

#### Mapping between visual components and code

There are mainly three parts of the visualization: map, bar chart and area chart.

* `index.html` serves for the HTML scaffolding and page description
* Styles for all three views are consolidated in a single `css/style.css`
* Common variables and interactions defined in `js/main.js`
* Map interactions are defined in `js/map.js`
* Bar chart interactions are defined in `js/stacked.js`
* Stacked area chart interactions are defined in `js/area.js`

---

#### Date files and import methods

* `data/mode_buckets.csv` and `data/aff_buckets.csv` are used to plot the data on the map. They have been uploaded to Google Fusion Table and accessed through the Google Fusion Table API.
* `data/commutes-by-area-aff.csv` and `data/commutes-by-area-mode.csv` are used in stacked bar chart. They are accessed through `d3.csv` method.
* `data/dist_grouped.csv` is used in stacked area chart. It is accessed by `d3.csv` method.
* `data/mit-commuter-data-time.csv` is used to calculate the aggregated distance and time used in the header. It is preprocessed by `aggregate_dist_time.py` to a `JSON` and embodied in `main.js`.

---

#### Libraries used

* [D3](http://d3js.org/)
    * Use local version under `js`
* [Google Maps API](https://developers.google.com/maps/)
    * Use CDN hosted version
* [jQuery](http://jquery.com/)
    * Use local version under `js`
* [Bootstrap](http://twitter.github.io/bootstrap/)
    * Use local version under `js` and `css` directories
* [intro.js](http://usablica.github.io/intro.js/)
    * Use local version under `js` and `css` directory

---

#### Code and example referenced

* [Boston apartment price maps](http://www.jefftk.com/news/2013-01-29)
    * Author: Jeff Kaufman
* [Google Maps API tutorial](https://developers.google.com/maps/documentation/javascript/examples/layer-fusiontables-simple)
    * Author: Google Inc.
* [Stacked area chart](http://bl.ocks.org/mbostock/3885211)
    * Author: Mike Bostock
* [Stacked-to-Multiples](http://bl.ocks.org/mbostock/4679202)
    * Author: Mike Bostock


