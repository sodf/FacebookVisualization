var width = 1000,
    height = 700;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .gravity(.05)
    .distance(function(d){
      return d.distance;
    })
    .charge(-100)
    .size([width, height]);

d3.json("graph.json", function(error, json) {
  force
      .nodes(json.nodes)
      .links(json.links)
      .start();

  var link = svg.selectAll(".link")
      .data(json.links)
    .enter().append("line")
      .attr("class", function(d){
        if(d.gender=="male"){
          return "linkMale";
        }
        else{
          return "linkFemale";
        }
      });

  var node = svg.selectAll(".node")
      .data(json.nodes)
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag);


var nodes = force.nodes(),
    links = force.links();

restart();


function restart() {
  link = link.data(links);


  link.enter().insert("line", ".node")
      .attr("class", "link");

  node = node.data(nodes);

  node.enter().insert("circle", ".cursor")
      .attr("class", "node")
      .attr("r", 5)
      .call(force.drag);

  force.start();
}

svg.append("g")
   .attr("class", "popup-wrapper")
   .attr("opacity", 0)
   .append("foreignObject")
   .attr("height", 100)
   .attr("width", 216)
   .append("xhtml:body")
   .append("div")
   .attr("class", "popup-container")
   .html("<div class='popup-left'>" + 
            "<div class='popup-like-icon'><img src='images/like-icon.png' height='50px' width='50px'/></div> <div class='popup-like'>3</div>" +
            "<div class='popup-comment-icon'><img class='msg-icon' src='images/msg-icon.png' height='28px' width='28px'/></div>" +
            "<div class='popup-comment'>5</div>" +
         "</div><div class='popup-picture'><img class='popup-image' src='images/picture.jpg' width='130px' height='100px'/></div>");
  
var defs = svg.append("defs").attr("id", "imgdefs")


for (var i = 0; i < json.nodes.length; i++) {
  n = json.nodes[i];
  defs.append("pattern")
    .attr("id", function(){return "nodepattern"+n.name;})
    .attr("height", 1)
    .attr("width", 1)
    .attr("x", "0")
    .attr("y", "0")
    .append("image")
    .attr("x", -360)
    .attr("y", -230)
    .attr("height", 640)
    .attr("width", 700)
    .attr("xlink:href",function(d){return n.image;});
}


  node.append("circle")
    .attr("r", 50)
    .attr("cy", 0)
    .attr("cx", 0)
    .attr("fill", function(d){return "url(#nodepattern"+d.name+")";})
    .on("mouseover", function(node){
       if(node.name == 'node1') return;
       d3.select(".popup-wrapper")
         .attr("transform", "translate(" + (node.x + 52)  + "," + (node.y - 50) + ")")
         .transition().duration(300).attr("opacity", 1)
    })
    .on("mouseout", function(){ 
       d3.select(".popup-wrapper").transition().duration(300).attr("opacity", 0);
    })

  node.append("text")
      .attr("dx", 55)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
});

function updatePopup(like, comment, image) {
   d3.select(".popup-like").text(like);
   d3.select(".popup-comment").text(comment);
   d3.select(".popup-image").attr("src", image);
}