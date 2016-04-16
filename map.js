
var width = 960,
    height = 1160;

var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);
var test;
d3.json("nyccensus.json", function(error, nyc) {
	if (error) {return console.error(error)}
	var subunits = topojson.feature(nyc, nyc.objects.census)

  test = subunits;

  //
	var projection = d3.geo.mercator()
    .center([-73.94, 40.70])
    .scale(60000)
		.translate([width / 2, height / 2])
  //
	var path = d3.geo.path()
		.projection(projection);
  //

  features = subunits.features

  features.forEach(function(feature, i) {
    feature.centroid = path.centroid(feature);
    if (feature.centroid.some(isNaN)) feature.centroid = null; // off the map
  });

  color = d3.scale.sqrt()
    .domain([0,0.007])
    // .range(["#deebf7","#08306b"])
    .range(["#fff","#000"])

  var tracts = svg.selectAll('.tcontainer')
      .data(features)
      .enter()
      .append("g")
      .attr('class','tcontainer')
      .append("path")
      .attr('class','tpath')
      .attr("d", path)
      .attr("fill",'#fff')
      .on("click", function(d){
        dcenter(this.parentNode)
      });

  function dcenter(tct) {
    reset();
    var hl_circ = d3.select(tct).selectAll('circle')
      .attr('class','census-centr-on');
    var ref_coord = projection.invert(hl_circ.datum().centroid);
    tracts = set_new_loc(ref_coord)
  }

  function reset() {
    d3.selectAll('.census-centr-on')
      .attr('class','census-centr-off');
  }

  function set_new_loc(coords) {
    d3.selectAll('.tpath')
      .attr('fill',function(d){
        return color(d3.geo.distance(coords,projection.invert(d.centroid)))
      })
  }

  var dots = svg.selectAll('.tcontainer')
    .append('circle')
    .attr('class','census-centr-off')
    .attr('transform',function(d){
      return 'translate (' + d.centroid[0] + ',' +d.centroid[1] + ')'
    })
    .attr('r',2)

})
