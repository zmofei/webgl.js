/**
 * this file is try to solve the path and outline
 * if you give a certain path with width , it will return the path of the outline
 * @author Mofei Zhu <hello@zhuwenlong.com>
 **/

var canvas = document.getElementById('webgl');
var ctx = canvas.getContext('2d');

// var canvas = document.getElementById('webgl2');
// var ctx2 = canvas.getContext('2d');

console.time('start')
    // product path by random
var paths = [];
for (var i = 0; i < 10; i++) {
    paths.push([Math.random() * 500 | 0, Math.random() * 500 | 0])
}

// var paths = [
//     [300, 300],
//     [30, 100],
//     [30, 600],
//     [300, 30],
//     [400, 30],
//     [500, 30],
//     [500, 130],
//     [500, 230],
//     [600, 330],
//     [700, 430]
// ]
var paths = [
    [300, 300],
    [300, 600],
    [600, 600],
    [600, 300],
    [300, 300],
]


// the line's width
var width = 40;
var harfWidth = width / 2;
var quarterWidth = harfWidth / 2;

/**
 * step 2
 * judeg the new segment is cross the old line
 **/
var newPoint = [];
for (var i = 0; i < paths.length; i++) {
    if (i >= 3) {
        // judeg cross
        var headSegment = [paths[i - 1], paths[i]];
        for (var j = 1; j <= i - 2; j++) {
            var oldSegment = [paths[j - 1], paths[j]];
            var iC = isCross(headSegment, oldSegment, true);
            if (iC) {
                var point = [iC.x, iC.y];
                newPoint[i] = newPoint[i] || [];
                newPoint[i].push(point);
                newPoint[j] = newPoint[j] || [];
                newPoint[j].push(point);
            }
        }
    }
}


/**
 * step 3 insert the point
 */
for (var i = newPoint.length - 1; i >= 0; i--) {
    if (newPoint[i] && newPoint[i].length >= 2) {
        var newOrder = sortPoint(paths[i - 1], newPoint[i]);
        newPoint[i] = newOrder;
    }

    if (newPoint[i]) {
        for (var j in newPoint[i]) {
            paths.splice(i, 0, newPoint[i][j])
        }
    }
}

console.timeEnd('start');

// get all the cross point
var crossPoint = {};
for (var i = 0; i < paths.length; i++) {
    var x = paths[i][0];
    var y = paths[i][1];
    var key = x + '|' + y;

    crossPoint[key] = crossPoint[key] || [];
    if (paths[i - 1]) {
        crossPoint[key].push([paths[i - 1][0], paths[i - 1][1]])
    };
    if (paths[i + 1]) {
        paths[i + 1] && crossPoint[key].push([paths[i + 1][0], paths[i + 1][1]]);
    }
}


console.log('crossPoint:', crossPoint);
var cross = {};

for (var i in crossPoint) {
    if (crossPoint[i].length !== 4) {
        continue;
    }

    cross[i] = cross[i] || [];

    var startPoint = crossPoint[i][0];
    var thisPoint = [Number(i.split('|')[0]), Number(i.split('|')[1])];
    var nextPoint = crossPoint[i][2];
    var vectorys = getVectorByThreePoint(startPoint, thisPoint, nextPoint);
    cross[i].push([thisPoint[0] + vectorys.toBisector[0], thisPoint[1] + vectorys.toBisector[1]]);
    cross[i].push([thisPoint[0] - vectorys.toBisector[0], thisPoint[1] - vectorys.toBisector[1]]);

    var startPoint = crossPoint[i][0];
    var thisPoint = [Number(i.split('|')[0]), Number(i.split('|')[1])];
    var nextPoint = crossPoint[i][3];
    var vectorys = getVectorByThreePoint(startPoint, thisPoint, nextPoint);
    cross[i].push([thisPoint[0] + vectorys.toBisector[0], thisPoint[1] + vectorys.toBisector[1]]);
    cross[i].push([thisPoint[0] - vectorys.toBisector[0], thisPoint[1] - vectorys.toBisector[1]]);
}

for (var i = 0; i < paths.length; i++) {
    // break
    var startPoint = paths[i - 1] ? paths[i - 1] : paths[i];
    var thisPoint = paths[i];
    var nextPoint = paths[i + 1] ? paths[i + 1] : paths[i];

    var key = paths[i][0] + '|' + paths[i][1];
    if (crossPoint[key].length == 4) {
        continue;
    }
    cross[key] = cross[key] || [];

    var vectorys = getVectorByThreePoint(startPoint, thisPoint, nextPoint);
    cross[key].push([thisPoint[0] + vectorys.toBisector[0], thisPoint[1] + vectorys.toBisector[1]]);
    cross[key].push([thisPoint[0] - vectorys.toBisector[0], thisPoint[1] - vectorys.toBisector[1]]);
}

console.log(cross)

// get the outline path
var outlines = [];
for (var i = 0; i < paths.length - 1; i++) {
    /*
        v3 -------  v2
        v4 |         | v1
             |         |
        v5 -------  v6
     */
    var v1, v2, v3, v4, v5, v6;

    var key = paths[i][0] + '|' + paths[i][1];
    var keyNext = paths[i + 1][0] + '|' + paths[i + 1][1];
    console.log(paths)
    v1 = paths[i];
    v4 = paths[i + 1];
    console.log('v1', v1)
    console.log('v4', v4)

    if (cross[key].length == 4) {
        var v1PointssortByV4 = sortPoint(v4, [cross[key][0], cross[key][1], cross[key][2], cross[key][3]]);
        v2 = v1PointssortByV4[2]
        v6 = v1PointssortByV4[3]
    } else {
        v2 = cross[key][0];
        v6 = cross[key][1];
    }
    // console.warn('######', cross[keyNext][0], cross[keyNext][1])
    if (cross[keyNext].length == 4) {
        var v4PointssortByV1 = sortPoint(v1, [cross[keyNext][0], cross[keyNext][1], cross[keyNext][2], cross[keyNext][3]]);
        v3 = v4PointssortByV1[2]
        v5 = v4PointssortByV1[3]
    } else {
        v3 = cross[keyNext][0];
        v5 = cross[keyNext][1];
    }

    if (isCross([v3, v2], [v5, v6])) {
        var temp = v5;
        v5 = v3;
        v3 = temp
    }

    _outlines = [];
    _outlines.push(v1, v2, v3, v4, v5, v6);
    _outlines = _outlines.map(function(item) {
        return item.map(function(si) {
            return si.toFixed(2);
        })
    });
    outlines.push(_outlines);
    console.log('index:', i, _outlines[0], _outlines[1], _outlines[2], _outlines[3], _outlines[4], _outlines[5]);
    // break;
}
// console.log('outlines:', outlines)

// for (var i = outlines.length-1; i < outlines.length; i++) {
for (var i = 0; i < outlines.length; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#f00';
    ctx.moveTo(outlines[i][0][0], outlines[i][0][1]);
    for (var j = 1; j < outlines[i].length; j++) {
        if (j == 2 || j == 5) {
            ctx.moveTo(outlines[i][j][0], outlines[i][j][1]);
        } else {
            ctx.lineTo(outlines[i][j][0], outlines[i][j][1]);
        }
    }
    ctx.moveTo(outlines[i][5][0], outlines[i][5][1]);
    ctx.lineTo(outlines[i][0][0], outlines[i][0][1]);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'grey';

    ctx.moveTo(outlines[i][1][0], outlines[i][1][1]);
    ctx.lineTo(outlines[i][2][0], outlines[i][2][1]);
    ctx.moveTo(outlines[i][4][0], outlines[i][4][1]);
    ctx.lineTo(outlines[i][5][0], outlines[i][5][1]);
    ctx.closePath();
    ctx.stroke();
    // break;
}


function getVectorByThreePoint(startPoint, thisPoint, nextPoint) {

    var vCToSX = startPoint ? (startPoint[0] - thisPoint[0]) : 0;
    var vCToSY = startPoint ? (startPoint[1] - thisPoint[1]) : 0;
    var vCToS = [vCToSX, vCToSY];

    var vCToNX = nextPoint ? (nextPoint[0] - thisPoint[0]) : 0;
    var vCToNY = nextPoint ? (nextPoint[1] - thisPoint[1]) : 0;
    var vCToN = [vCToNX, vCToNY];

    var vCtoSCrossvCToN = vCToS[0] * vCToN[0] + vCToS[1] * vCToN[1]
    var mCToSmvCToN = Math.sqrt((vCToS[0] * vCToS[0] + vCToS[1] * vCToS[1]) * (vCToN[0] * vCToN[0] + vCToN[1] * vCToN[1]))
    var red = mCToSmvCToN == 0 ? 0 : Math.PI - Math.acos(vCtoSCrossvCToN / mCToSmvCToN);
    // console.log('xxx')
    if (red === 0) {
        var k = (vCToS[1] / vCToS[0]) || (vCToN[1] / vCToN[0])
        var _red = Math.atan(k) + Math.PI / 2;
        if (_red || Math.abs(k) == Infinity) {
            var x = (width / 2) * Math.cos(_red);
            var y = (width / 2) * Math.sin(_red);
        } else {
            var x = 0
            var y = (width / 2)
        }

        // console.log('@@@@', _red, x, y)
        return {
            toStart: [0, 0],
            toNext: [0, 0],
            toBisector: [x, y]
        };
    }

    var useWidth = width / Math.sin(red);

    var dCrossToStart = getDistenceByTwoPoint(thisPoint, startPoint);
    var sCrossToStart = useWidth / 2 / dCrossToStart;
    var vCrossToStartX = (startPoint[0] - thisPoint[0]) * sCrossToStart + thisPoint[0];
    var vCrossToStartY = (startPoint[1] - thisPoint[1]) * sCrossToStart + thisPoint[1];
    var vCrossToStartEnd = [vCrossToStartX, vCrossToStartY];
    var vCrossToStart = [vCrossToStartEnd[0] - thisPoint[0], vCrossToStartEnd[1] - thisPoint[1]];

    var dCrossToNext = getDistenceByTwoPoint(thisPoint, nextPoint);
    var sCrossToNext = useWidth / 2 / dCrossToNext;
    var vdCrossToNextX = (nextPoint[0] - thisPoint[0]) * sCrossToNext + thisPoint[0];
    var vCrossToNextY = (nextPoint[1] - thisPoint[1]) * sCrossToNext + thisPoint[1];
    var vCrossToNextEnd = [vdCrossToNextX, vCrossToNextY];
    var vCrossToNext = [vCrossToNextEnd[0] - thisPoint[0], vCrossToNextEnd[1] - thisPoint[1]];

    var vCrossToStartAddNext = [vCrossToStart[0] + vCrossToNext[0], vCrossToStart[1] + vCrossToNext[1]];
    return {
        toStart: vCrossToStart,
        toNext: vCrossToNext,
        toBisector: vCrossToStartAddNext
    }
}

/**
 * get the vertical and the vertiacl ends by give k and point
 * @param  {Number} k      the line's k
 * @param  {Array} center the line's end which you want draw the vertical
 * @param  {Number} width  How width the new line is
 * @return {Array}
 */
function getVerticalEnds(k, center, width) {
    var x = center[0];
    var y = center[1];
    var rad = Math.atan(k);
    var dX = width * Math.sin(rad);
    var dY = width * Math.cos(rad);

    var _dX = dX / 2;
    var _dY = dY / 2;
    var _x1 = x - _dX;
    var _y1 = y - _dY;
    var _x2 = x + _dX;
    var _y2 = y + _dY;
    return [
        [_x1, _y1],
        [_x2, _y2]
    ]
}

/**
 * sort a list of array
 * @param  {Array} startEnd [description]
 * @param  {Array} points   [description]
 * @return {Array}          [description]
 */
function sortPoint(startEnd, points) {
    points.sort(function(a, b) {
        var startX = startEnd[0];
        var startY = startEnd[1];
        var dA = Math.sqrt(Math.pow(a[0] - startX, 2) + Math.pow(a[1] - startY, 2), 2);
        var dB = Math.sqrt(Math.pow(b[0] - startX, 2) + Math.pow(b[1] - startY, 2), 2);
        return dB - dA;
    });
    return points;
}

/**
 * @method isCross
 * @param line1/line2 {Array} the first/second line's two end, e.g [[1,1],[2,2]]
 * @trueCross [bool] make sure the cross is not on the end
 * @return bool
 **/
function isCross(line1, line2, trueCross) {
    var line1Equation = getEquationByTwoPoint(line1[0], line1[1]);
    var line2Equation = getEquationByTwoPoint(line2[0], line2[1]);

    var verticalCount = 0;
    if (Math.abs(line1Equation.k) == Infinity) verticalCount++;
    if (Math.abs(line2Equation.k) == Infinity) verticalCount++;

    if (verticalCount == 0) {
        var x = (line2Equation.b - line1Equation.b) / (line1Equation.k - line2Equation.k);
        var y = line1Equation.k * x + line1Equation.b;

        var pointInSegment1 = isPointInSegment([x, y], line1);
        var pointInSegment2 = isPointInSegment([x, y], line2);

        if (pointInSegment1 && pointInSegment2) {
            var onTheEnd = false;
            if (pointInSegment1.x == line1[0][0] && pointInSegment1.y == line1[0][1]) {
                onTheEnd = true;
            }
            if (pointInSegment1.x == line1[1][0] && pointInSegment1.y == line1[1][1]) {
                onTheEnd = true;
            }
            if (pointInSegment1.x == line2[0][0] && pointInSegment1.y == line2[0][1]) {
                onTheEnd = true;
            }
            if (pointInSegment1.x == line2[1][0] && pointInSegment1.y == line2[1][1]) {
                onTheEnd = true;
            }
            if (trueCross) {
                if (onTheEnd) {
                    return false;
                }
            }
            return pointInSegment1;
        } else {
            return false;
        }
    } else if (verticalCount == 1) {
        var maxY, minY, x, y;
        if (Math.abs(line1Equation.k) == Infinity) {
            x = line1Equation.x;
            y = line2Equation.k * x + line2Equation.b;
            maxY = Math.max(line1[0][1], line1[1][1]);
            minY = Math.min(line1[0][1], line1[1][1]);
        } else {
            x = line2Equation.x;
            y = line1Equation.k * x + line1Equation.b;
            maxY = Math.max(line2[0][1], line2[1][1]);
            minY = Math.min(line2[0][1], line2[1][1]);
        }
        if (y >= minY && y <= maxY) {
            var onTheEnd = false;
            if (x == line1[0][0] && y == line1[0][1]) {
                onTheEnd = true;
            }
            if (x == line1[1][0] && y == line1[1][1]) {
                onTheEnd = true;
            }
            if (x == line2[0][0] && y == line2[0][1]) {
                onTheEnd = true;
            }
            if (x == line2[1][0] && y == line2[1][1]) {
                onTheEnd = true;
            }
            if (trueCross) {
                if (onTheEnd) {
                    return false;
                }
            }
            return {
                x, y
            }
        } else {
            return false;
        }
    } else if (verticalCount == 2) {
        return false;
    }

}

function isPointInSegment(point, segment) {
    var x = point[0];
    var y = point[1];
    var point1X = segment[0][0];
    var point1Y = segment[0][1];
    var point2X = segment[1][0];
    var point2Y = segment[1][1];
    var minX = Math.min(point1X, point2X);
    var maxX = Math.max(point1X, point2X);
    var minY = Math.min(point1Y, point2Y);
    var maxY = Math.max(point1Y, point2Y);
    var isXCross = (x >= minX && x <= maxX);
    var isYCross = (y >= minY && y <= maxY);

    if (isXCross && isYCross) {
        return {
            x, y
        }
    } else {
        return false;
    }
}

/**
 * @method getEquationByTwoPoint
 * @param point1/point2 {Array}
 * @return {k, b}
 **/
function getEquationByTwoPoint(point1, point2) {
    var point1X = point1[0];
    var point1Y = point1[1];
    var point2X = point2[0];
    var point2Y = point2[1];

    var lineDx = point2X - point1X;
    var lineDy = point2Y - point1Y;
    var k = lineDy / lineDx;

    var b = point2Y - k * point2X;

    var x = Math.abs(k) == Infinity ? point1X : null;
    return {
        k, b, x
    }
}

function getDistenceByTwoPoint(point1, point2) {
    return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2), 2)
}
