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

* Map
    * County paths defined in `index.html`
    * Interactions defined in `main.js`
    * Styles defined in `style.css`
* Bar chart
    * Menus and svg defined in `index.html`
    * Interactions defined in `barchart.js`
    * Styles defined in `style.css`
* Area chart
    * Menus and svg defined in `index.html`
    * Interactions defined in `area.js`
    * Styles defined in `area.css`

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
* [Underscore](http://underscorejs.org/)
    * Use local version under `js` directory
* [intro.js](http://usablica.github.io/intro.js/)
    * Use local version under `js` and `css` directory

---

#### Date files and import methods

`data/mit-commuter-data.csv` is used in the code. It is imported by `d3.csv` method.

---

#### Code referenced

* [Boston apartment price maps](http://www.jefftk.com/news/2013-01-29)
* [Google Maps API tutorial](https://developers.google.com/maps/documentation/javascript/examples/layer-fusiontables-simple)




