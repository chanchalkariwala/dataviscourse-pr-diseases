class wordCloud {
    constructor(data,onchange=0) {
        this.data = data;
        this.margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        };
        this.onchange=onchange;
        let wordcloudChart = d3.select("#wordCloudChart");
        this.loader=$("#wordLoader");
        //Gets access to the div element created for this chart from HTML
        this.svgWidth = 1500;
        this.svgHeight = 1000;
        //creates svg element within the div
        this.svg = wordcloudChart.append("svg")
            .attr("width", "100%")
            .attr("height", this.svgHeight)
            .attr("style","background:black")
            .append("g")
            .attr("transform", "translate(600,500)");
        this.svgWidth = this.svgWidth - this.margin.left - this.margin.right,
            this.svgHeight = this.svgWidth - this.margin.top - this.margin.bottom;

    };
update(){
  this.loader.show();
  if(this.onchange){
    d3.select("#wordCloudChart").select("svg").remove();
    if(Object.keys(this.data).length==0)
      return;
  }
      
   var draw=function draw(words) {
    wordcloud.selectAll("text")
        .data(words)
        .enter().append("text")
        .attr('class','word')
        .style("fill", function(d, i) { return color(i); })
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", function(d) { return d.font; })
        .attr("size",function(d) { return d.size; })
        //.style("fill", function(d) { 
            //var paringObject = data.filter(function(obj) { return obj.Team_CN === d.text});
           // return color(paringObject[0].category); 
        //})
        .attr("text-anchor", "middle")
        .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
        .text(function(d) { return d.text; });
      $("#wordLoader").hide();
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
data=data.slice(0,1000);
var color = d3.scaleOrdinal(d3.schemeCategory20);
//var categories = d3.keys(d3.nest().key(function(d) { return d.State; }).map(data));
//var fontSize = d3.scalePow().exponent(5).domain([data[data.length-1][1],data[0][1]]).range([10,100]);
var fontSize = d3.scaleLinear().domain([data[data.length-1][1],data[0][1]]).range([10,100]);
//var fontStyle = d3.scaleLinear().domain([categories]).range(['楷体','仿宋']);

var layout = d3.layout.cloud()
      .size([this.svgWidth-500, this.svgHeight-500])
      .timeInterval(1)
      .words(data)
      .rotate(function(d) {let angle=Math.random()*100;return ( angle>50?-90:0) })// return 0;})//
      .fontSize(function(d,i) {return fontSize(d[1])})
//fontSize(aa.filter(item => item == d.Team_EN).length)
      //return fontSize(Math.random()); })
      //.fontStyle(function(d,i) { return fontSyle(Math.random()); })
      .fontWeight(["bold"])
      .text(function(d) { return d[0]; })
      .spiral("rectangular") // "archimedean" or "rectangular"
      .on("end", draw)
      .start();

   var wordcloud = this.svg
      .attr('class','wordcloud')
      //.attr("transform", "translate(100," + 100 + ")");   
  }
}