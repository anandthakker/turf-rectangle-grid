var point = require('turf-point');
var polygon = require('turf-polygon');
var distance = require('turf-distance');

/**
 * Takes a bounding box and cell dimensions and returns a set of rectangular {@link Polygon|polygons} in a grid.
 *
 * @module turf/rectangle-grid
 * @category interpolation
 * @param {Array<number>} extent extent in [minX, minY, maxX, maxY] order
 * @param {Array<number>} cellShape [cellWidth, cellHeight] each cell
 * @param {String} units units to use for cellWidth and cellHeight
 * @return {FeatureCollection<Polygon>} grid a grid of polygons
 * @example
 * var extent = [-77.3876953125,38.71980474264239,-76.9482421875,39.027718840211605];
 * var cellShape = [10, 10];
 * var units = 'miles';
 *
 * var grid = turf.rectangleGrid(extent, cellWidth, units);
 *
 * //=squareGrid
 */
module.exports = function (bbox, cell, units) {
  var fc = { type: 'FeatureCollection', features: [] }
  var xFraction = cell[0] / (distance(point([bbox[0], bbox[1]]), point([bbox[2], bbox[1]]), units));
  var cellWidth = xFraction * (bbox[2] - bbox[0]);
  var yFraction = cell[1] / (distance(point([bbox[0], bbox[1]]), point([bbox[0], bbox[3]]), units));
  var cellHeight = yFraction * (bbox[3] - bbox[1]);

  var currentX = bbox[0];
  while (currentX <= bbox[2]) {
    var currentY = bbox[1];
    while (currentY <= bbox[3]) {
      var cellPoly = polygon([[
          [currentX, currentY],
          [currentX, currentY+cellHeight],
          [currentX+cellWidth, currentY+cellHeight],
          [currentX+cellWidth, currentY],
          [currentX, currentY]
        ]]);
      fc.features.push(cellPoly);

      currentY += cellHeight;
    }
    currentX += cellWidth;
  }

  return fc;
}
