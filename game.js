/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
var playerArray = [];
var wreckArray = [];
var tankerArray = [];

var destroyerArray = [];
var allArray = [];
var moreThan0 = false;
// game loop
while (true) {
    playerArray = [];
    wreckArray = [];
    tankerArray = [];
    destroyerArray = [];
    allArray = [];
    var myScore = parseInt(readline());
    var enemyScore1 = parseInt(readline());
    var enemyScore2 = parseInt(readline());
    var myRage = parseInt(readline());
    var enemyRage1 = parseInt(readline());
    var enemyRage2 = parseInt(readline());
    var unitCount = parseInt(readline());
    for (var i = 0; i < unitCount; i++) {
        var inputs = readline().split(' ');
        var unitId = parseInt(inputs[0]);
        var unitType = parseInt(inputs[1]);
        var player = parseInt(inputs[2]);
        var mass = parseFloat(inputs[3]);
        var radius = parseInt(inputs[4]);
        var x = parseInt(inputs[5]);
        var y = parseInt(inputs[6]);
        var vx = parseInt(inputs[7]);
        var vy = parseInt(inputs[8]);
        var extra = parseInt(inputs[9]);
        var extra2 = parseInt(inputs[10]);
        //   printErr(inputs)
        if (unitType == 0) {
            playerArray.push([x, y, radius, vx, vy, player]);
        } else if (unitType == 4) {
            if (extra> 1)
                wreckArray.push([x, y, extra])
        } else if (unitType == 3) {
            if (extra > 1)
                tankerArray.push([x, y, radius,extra]);
        } else if (unitType == 1) {
            destroyerArray.push([x, y, player])
        }
        if ( !unitType==4 && !unitType== 0)
            allArray.push([x, y, radius])
    }


    printErr(playerArray)
    var p = playerArray.filter(e => e[5] === 0)[0];
    var d = destroyerArray.filter(e => e[2] === 0)[0];
    printErr(p.player)
    wreckArray.sort(function (a, b) {
        return distance(p, a) - distance(p, b)
    });
    tankerArray.sort(function (a, b) {
        return distance(d, a)  - distance(d, b);
    });

    var w = wreckArray[0];
    var t = tankerArray[0];

    if (w) {
        printErr(p[0], p[1], p[3], p[4], w[0], w[1])
        var smartMove = move_to_point(p[0], p[1], p[3], p[4], w[0], w[1],Math.round(distance(p,w)))
        print(smartMove[0] + ' ' + smartMove[1] + ' ' + Math.round(distance(p,w)));
    } else {
        if (t) print(t[0] + ' ' + t[1] + ' ' + 300);
        else print(d[0] + ' ' + d[1] + ' ' + 300);
    }

    if (t) {
        if (myRage > 100){
            if (enemyScore1 > enemyScore2) var x = playerArray.filter(e => e[5] === 1)[0]
            else var x = playerArray.filter(e => e[5] === 2)[0]
            print('SKILL'+ ' ' + x[0] + ' ' + x[1];
        }else
            print(t[0] + ' ' + t[1] + ' ' + 300);

    } else {
        print(0 + ' ' + 0 + ' ' + 300);
    }


    if (enemyScore1 > enemyScore2) var x = playerArray.filter(e => e[5] === 1)[0]
    else var x = playerArray.filter(e => e[5] === 2)[0]
    print(x[0] + ' ' + x[1] + ' ' + 500);
}

function distance(p0, p1) {
    return Math.sqrt(Math.pow((p0[0] - p1[0]), 2) + Math.pow((p0[1] - p1[1]), 2));
}

function findMostThreateningObstacle(ahead) {
    var mostThreatening = null;

    for (var i = 0; i < allArray.length; i++) {
        var obstacle = allArray[i]
        var collision = lineIntersectsCircle(ahead, obstacle);

        // "position" is the character's current position
        if (collision && (mostThreatening == null || distance(p, obstacle) < distance(p, mostThreatening))) {
            mostThreatening = obstacle;
        }
    }
    return mostThreatening;
}

function collisionAvoidance(ahead) {

    var mostThreatening = findMostThreateningObstacle(ahead);
    var avoidance = [];

    if (mostThreatening != null) {
        avoidance[0] = ahead[0] - mostThreatening[0];
        avoidance[1] = ahead[1] - mostThreatening[1];
    } else {
        avoidance[0] = 0;
        avoidance[1] = 0;
    }

    return avoidance;
}

function lineIntersectsCircle(ahead, obstacle) {
    // the property "center" of the obstacle is a Vector3D.
    printErr("____" + distance([obstacle[0], obstacle[1]], [ahead[0], ahead[1]]));
    return distance([obstacle[0], obstacle[1]], [ahead[0], ahead[1]]) <= obstacle[3];
}

function move_to_point(point_x, point_y, velocity_x, velocity_y, target_x, target_y,v) {
    const ahead = [(point_x + velocity_x)*150, (point_y + velocity_y)*150 ];
    const desired_velocity = normalize(target_x, target_y, point_x, point_y, 300);
    printErr(desired_velocity)
    let steer = [desired_velocity[0] - velocity_x, desired_velocity[1] - velocity_y]
    const c = collisionAvoidance(ahead)
    steer = [steer[0] + c[0], steer[1] + c[1]]
    return [point_x + steer[0], point_y + steer[1]]
}


function normalize(point_x, point_y, point2_x, point2_y, maxVelocity) {
    var dx = point_x - point2_x;
    var dy = point_y - point2_y;
    printErr(dx, dy);
    var dd = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    var xNorm = dx;
    var yNorm = dy;
    return [Math.round(xNorm) * maxVelocity, Math.round(yNorm) * maxVelocity];
}