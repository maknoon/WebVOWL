
module.exports =  function (graph) {
    /** variable defs **/
    var Domain_dragger={};
    Domain_dragger.nodeId = 10002;
    Domain_dragger.parent = undefined;
    Domain_dragger.x = 0;
    Domain_dragger.y = 0;
    Domain_dragger.rootElement = undefined;
    Domain_dragger.rootNodeLayer = undefined;
    Domain_dragger.pathLayer=undefined;
    Domain_dragger.mouseEnteredVar = false;
    Domain_dragger.mouseButtonPressed = false;
    Domain_dragger.nodeElement = undefined;
    Domain_dragger.draggerObject= undefined;

    Domain_dragger.pathElement = undefined;
    Domain_dragger.typus = "Domain_dragger";

    Domain_dragger.type = function () {
            return Domain_dragger.typus;
    };


    // TODO: We need the endPoint of the Link here!
    Domain_dragger.parentNode = function () {
            return Domain_dragger.parent;
    };

    Domain_dragger.hide_dragger=function(val){
        Domain_dragger.pathElement.classed("hidden",val);
        Domain_dragger.nodeElement.classed("hidden",val);
        Domain_dragger.draggerObject.classed("hidden",val);
    };

    Domain_dragger.reDrawEverthing=function(){
        Domain_dragger.setParentProperty(Domain_dragger.parent);
    };
    Domain_dragger.updateDomain=function(newDomain){
        Domain_dragger.parent.domain(newDomain);
        // update the position of the new range
        var rX = Domain_dragger.parent.range().x;
        var rY = Domain_dragger.parent.range().y;
        var dX = newDomain.x;
        var dY = newDomain.y;

         // center
        var cX=0.49 * (dX+rX);
        var cY=0.49 * (dY+rY);
        // put position there;
        Domain_dragger.parent.labelObject().x   = cX;
        Domain_dragger.parent.labelObject().px  = cX;
        Domain_dragger.parent.labelObject().y   = cY;
        Domain_dragger.parent.labelObject().py  = cY;

    };

    Domain_dragger.setParentProperty = function (parentProperty) {
        Domain_dragger.parent = parentProperty;

        // get link range intersection;


        var iP=parentProperty.labelObject().linkDomainIntersection;

        Domain_dragger.x = iP.x;
        Domain_dragger.y = iP.y;

        Domain_dragger.updateElement();
    };

    Domain_dragger.hideDragger=function(val){
        Domain_dragger.pathElement.classed("hidden",val);
        Domain_dragger.nodeElement.classed("hidden",val);
        Domain_dragger.draggerObject.classed("hidden",val);


    };
    /** BASE HANDLING FUNCTIONS ------------------------------------------------- **/
    Domain_dragger.id = function (index) {
        if (!arguments.length) {
            return Domain_dragger.nodeId;
        }
        Domain_dragger.nodeId = index;
    };

    Domain_dragger.svgPathLayer=function(layer){
        Domain_dragger.pathLayer= layer.append('g');
    };

    Domain_dragger.svgRoot = function (root) {
        if (!arguments.length)
            return Domain_dragger.rootElement;
        Domain_dragger.rootElement = root;
        Domain_dragger.rootNodeLayer = Domain_dragger.rootElement.append('g');
        Domain_dragger.addMouseEvents();
    };

    /** DRAWING FUNCTIONS ------------------------------------------------- **/
    Domain_dragger.drawNode = function () {
            Domain_dragger.pathElement = Domain_dragger.pathLayer.append('line')
                .classed("classNodeDragPath", true);
            Domain_dragger.pathElement.attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", 0);

        var pathData="M 10,40 C -10,15 -10,-15 10,-40 -4.5025829,-20.448277 -15.80965,2.7180462 -50,0 -34.738882,3.0775446 -26.408173,-8.8435577 10,40 Z";
        Domain_dragger.nodeElement =Domain_dragger.rootNodeLayer.append('path').attr("d", pathData);
        Domain_dragger.nodeElement.classed("classDraggerNode",true);
        Domain_dragger.draggerObject=Domain_dragger.rootNodeLayer.append("circle");
        Domain_dragger.draggerObject.attr("r", 40)
            .attr("cx", 0)
            .attr("cy", 0)
            .classed("superHiddenElement",true)
            .append("title").text("Add Touch Object Property");



    };
    Domain_dragger.updateElementViaRangeDragger=function(x,y){
        var range_x=x;
        var range_y=y;

        var dex=Domain_dragger.parent.domain().x;
        var dey=Domain_dragger.parent.domain().y;

        var dir_X= x-dex;
        var dir_Y= y-dey;

        var len=Math.sqrt(dir_X*dir_X+dir_Y*dir_Y);

        var nX=dir_X/len;
        var nY=dir_Y/len;


        var ep_range_x=dex+nX*Domain_dragger.parent.domain().actualRadius();
        var ep_range_y=dey+nY*Domain_dragger.parent.domain().actualRadius();

        var angle = Math.atan2(ep_range_y-range_y  , ep_range_x-range_x ) * 180 / Math.PI ;
        Domain_dragger.nodeElement.attr("transform","translate(" + ep_range_x  + "," + ep_range_y  + ")"+"rotate(" + angle + ")");
    };


    Domain_dragger.updateElement = function () {
        if (Domain_dragger.mouseButtonPressed===true || Domain_dragger.parent===undefined) return;

        var range_x=Domain_dragger.parent.domain().x;
        var range_y=Domain_dragger.parent.domain().y;



        var ep_range_x=Domain_dragger.parent.labelObject().linkDomainIntersection.x;
        var ep_range_y=Domain_dragger.parent.labelObject().linkDomainIntersection.y;

        var angle = Math.atan2(ep_range_y-range_y  , ep_range_x-range_x ) * 180 / Math.PI +180;
        Domain_dragger.nodeElement.attr("transform","translate(" + ep_range_x  + "," + ep_range_y  + ")"+"rotate(" + angle + ")");
    };

        /** MOUSE HANDLING FUNCTIONS ------------------------------------------------- **/

        Domain_dragger.addMouseEvents = function () {
            var rootLayer=Domain_dragger.rootNodeLayer.selectAll("*");
            rootLayer.on("mouseover", Domain_dragger.onMouseOver)
                .on("mouseout", Domain_dragger.onMouseOut)
                 .on("click", function(){
                 })
                 .on("dblclick", function(){
                 })
                .on("mousedown", Domain_dragger.mouseDown)
                .on("mouseup", Domain_dragger.mouseUp);
        };

        Domain_dragger.mouseDown = function () {
            Domain_dragger.nodeElement.style("cursor", "move");
            Domain_dragger.nodeElement.classed("classDraggerNodeHovered", true);
            Domain_dragger.mouseButtonPressed = true;
        };

        Domain_dragger.mouseUp = function () {
            Domain_dragger.nodeElement.style("cursor", "auto");
            Domain_dragger.nodeElement.classed("classDraggerNodeHovered", false);
            Domain_dragger.mouseButtonPressed = false;
        };


        Domain_dragger.mouseEntered = function (p) {
            if (!arguments.length) return Domain_dragger.mouseEnteredVar;
            Domain_dragger.mouseEnteredVar = p;
            return Domain_dragger;
        };

        Domain_dragger.selectedViaTouch=function(val){
             Domain_dragger.nodeElement.classed("classDraggerNode", !val);
            Domain_dragger.nodeElement.classed("classDraggerNodeHovered", val);

        };

        Domain_dragger.onMouseOver = function () {
            if (Domain_dragger.mouseEntered()) {
                return;
            }
            Domain_dragger.nodeElement.classed("classDraggerNode", false);
            Domain_dragger.nodeElement.classed("classDraggerNodeHovered", true);
            var selectedNode = Domain_dragger.rootElement.node(),
                nodeContainer = selectedNode.parentNode;
            nodeContainer.appendChild(selectedNode);

            Domain_dragger.mouseEntered(true);

        };
        Domain_dragger.onMouseOut = function () {
            if (Domain_dragger.mouseButtonPressed === true)
                return;
            Domain_dragger.nodeElement.classed("classDraggerNodeHovered", false);
            Domain_dragger.nodeElement.classed("classDraggerNode", true);
            Domain_dragger.mouseEntered(false);
        };

        Domain_dragger.setPosition=function(x,y){
            var range_x=Domain_dragger.parent.range().x;
            var range_y=Domain_dragger.parent.range().y;

            // var position of the rangeEndPoint
            var ep_range_x=x;
            var ep_range_y=y;

            var angle = Math.atan2(range_y-ep_range_y  , range_x-ep_range_x ) * 180 / Math.PI+180;
            Domain_dragger.nodeElement.attr("transform","translate(" + ep_range_x  + "," + ep_range_y  + ")"+"rotate(" + angle + ")");
            // if (Range_dragger.pathElement) {
            Domain_dragger.x=x;
            Domain_dragger.y=y;

        };

        Domain_dragger.setAdditionalClassForClass_dragger = function (name, val) {
            // console.log("Class_dragger should sett the class here")
            // Class_dragger.nodeElement.classed(name,val);

        };
        return Domain_dragger;
};


