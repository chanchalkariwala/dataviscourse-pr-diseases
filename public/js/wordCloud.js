class wordCloud {
    constructor(data, onchange = 0, genres = 0) {
        this.data = data;
        this.margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        };
        let wordcloudChart = d3.select("#wordCloudChart");
        this.onchange = onchange;
        //Gets access to the div element created for this chart from HTML
        this.svgWidth = 500;
        this.svgHeight = 500;
        this.genres = genres;
        //creates svg element within the div
        this.svg = wordcloudChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
            .append("g")
            .attr("transform", "translate(120,52),scale(0.8)");
        this.svgWidth = this.svgWidth - this.margin.left - this.margin.right,
            this.svgHeight = this.svgWidth - this.margin.top - this.margin.bottom;

    };
update(){
   var draw=function draw(words) {
    wordcloud.selectAll("text")
        .data(words)
        .enter().append("text")
        .attr('class','word')
        .style("fill", function(d, i) { return color(i); })
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", function(d) { return d.font; })
        //.style("fill", function(d) { 
            //var paringObject = data.filter(function(obj) { return obj.Team_CN === d.text});
           // return color(paringObject[0].category); 
        //})
        .attr("text-anchor", "middle")
        .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
        .text(function(d) { return d.text; });
};
  var data=[];

for (var key in this.data) {
    if (this.data.hasOwnProperty(key)) {
        data.push( [ key, this.data[key] ] );
    }
};

data.sort(function(a, b) {
  return b[1] - a[1];
});
data=data.slice(0,100);
var color = d3.scaleOrdinal(d3.schemeCategory20);
//var categories = d3.keys(d3.nest().key(function(d) { return d.State; }).map(data));
var fontSize = d3.scalePow().exponent(5).domain([data[data.length-1][1],data[0][1]]).range([10,100]);
//var fontStyle = d3.scaleLinear().domain([categories]).range(['楷体','仿宋']);

var layout = d3.layout.cloud()
      .size([this.svgWidth, this.svgHeight])
      .timeInterval(1)
      .words(data)
      .rotate(function(d) {let angle=Math.random()*100;return ( angle>50?-90:0) })// return 0;})//
      .fontSize(function(d,i) {return fontSize(d[1])})
//fontSize(aa.filter(item => item == d.Team_EN).length)
      //return fontSize(Math.random()); })
      //.fontStyle(function(d,i) { return fontSyle(Math.random()); })
      .fontWeight(["bold"])
      .text(function(d) { return d[0]; })
      .spiral("archimedean") // "archimedean" or "rectangular"
      .on("end", draw)
      .start();

   var wordcloud = this.svg
      .attr('class','wordcloud')
      .attr("transform", "translate(" + this.svgWidth/2 + "," + this.svgHeight/2 + ")");   
  }
}