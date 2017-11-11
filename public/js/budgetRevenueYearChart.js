class budgetRevenueYearChart {	
constructor (budgetRevenueYear,movieDetails){
    this.budgetRevenueYear = budgetRevenueYear; 
    this.movieDetails = movieDetails;   
    this.margin = {top: 30, right: -50, bottom: 30, left: 50};
    let budgetRevenueYearChart = d3.select("#budgetRevenueYearChart");

    //Gets access to the div element created for this chart from HTML
    this.svgWidth = 1050;
    this.svgHeight = 1000;

    //creates svg element within the div
    this.svg = budgetRevenueYearChart.append("svg")
        .attr("width",this.svgWidth)
        .attr("height",this.svgHeight)
        .append("g")
        .attr("transform","translate(10,50)");
};

update(){
    d3.select("#budgetRevenueMovieDetails").text("Click on the bars to see year specific data. Animations and styling are yet to be completed.");  
    let self=this;
    let displayDetails= function(id){
        d3.select("#budgetRevenueMovieDetails").text("");   
        let movieDetails=[]
        for (let item of self.movieDetails)
        {
            if(item["year"]==id.split('-')[1])           
                 movieDetails.push(item);                 
        }
        let strong = document.createElement("strong");

        if(id.split('-')[0]=="bud")
        {
            strong.innerHTML="Top 5 expensive movies of the Year - "+id.split('-')[1]+"<br/>";
            movieDetails = movieDetails.sort(function(x, y){return d3.descending(x["budget"], y["budget"]);})
        }            
        else
        {
            strong.innerHTML="Top 5 successful movies of the Year - "+id.split('-')[1]+"<br/>";
            movieDetails = movieDetails.sort(function(x, y){return d3.descending(x["revenue"], y["revenue"]);})
        }          

        d3.select("#budgetRevenueMovieDetails").node().append(strong);         
        movieDetails=movieDetails.slice(0,5);
        let ul = document.createElement("ul");
        for (let item of movieDetails)
        {            
            let li = document.createElement("li");
            li.innerHTML = "<i>Title</i>: "+item["title"]+"<br/>"+"<i>Runtime: </i>"+item["runtime"]+"<br/>"+"<i>Avg. Rating: </i>"+item["vote_average"];
            if(id.split('-')[0]=="bud")
            {
                li.innerHTML = li.innerHTML + "<br/>"+"<i>Budget:</i>"+item["budget"]
            }  
            else
            {
                li.innerHTML = li.innerHTML + "<br/>"+"<i>Revenue:</i>"+item["revenue"]
            }
            ul.append(li);
        }
        d3.select("#budgetRevenueMovieDetails").node().append(ul);  
    }
	let years = this.budgetRevenueYear.map(function(a) {return a.year;});
    var x = d3.scaleBand().domain(years).range([30,1000]),
    y1 = d3.scaleLinear().domain([0, d3.max(this.budgetRevenueYear, function(d) { return d["revenue"]; })]).range([0,500]),
    y2 = d3.scaleLinear().domain([0, d3.max(this.budgetRevenueYear, function(d) { return d["revenue"]; })]).range([500,0]);      


    this.svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(20," + 500 + ")")
    .call(d3.axisBottom(x))
    .append("text")
    .attr("x", "520")
    .attr("dy","3.5em")
    .attr("fill","black")
    .attr("id","xAxisLabel")
    .attr("style","font-size:large")
    .text("Years");

    this.svg.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(50," + (this.svgHeight-1000) + ")")
    .call(d3.axisLeft(y2).ticks(10))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "-2.8em")  
    .attr("dx","-10em")  
    .attr("text-anchor", "end")
    .attr("fill","black")
    .attr("style","font-size:large")
    .text("Budget & Revenue in Million");

    this.svg.selectAll(".budgetYearBar")
    .data(this.budgetRevenueYear)
    .enter().append("rect").attr("fill","#19C4CC")
    .attr("class", "budgetYearBar")
    .attr("id", function(d){return "bud-"+d["year"]})    
    .attr("x", function(d) { return 22+x(d["year"]); })
    .attr("y", function(d) { return 500-y1(d["budget"]); })
    .attr("width", 7)
    .transition()
    .duration(1000)
    .attr("height", function(d) { return y1(d["budget"]); })
    this.svg.selectAll(".budgetYearBar")
    .on("click",function(){displayDetails(this.id)});


    this.svg.selectAll(".revenueYearBar")
    .data(this.budgetRevenueYear)
    .enter().append("rect").attr("fill","#F88181")
    .attr("class", "revenueYearBar")
    .attr("id", function(d){return "rev-"+d["year"]})
    .attr("x", function(d) { return 29+x(d["year"]); })
    .attr("y", function(d) { return 500-y1(d["revenue"]); })
    .attr("width", 7)
    .transition()
    .duration(1000)
    .attr("height", function(d) { return y1(d["revenue"]); })
    this.svg.selectAll(".revenueYearBar")
    .on("click",function(){displayDetails(this.id)});

    d3.select(".axis--x").selectAll("text:not(#xAxisLabel)").attr("transform","rotate(-70)");
    d3.select(".axis--x").selectAll("text:not(#xAxisLabel)").attr("dy","-0.50em");
    d3.select(".axis--x").selectAll("text:not(#xAxisLabel)").attr("x","-20");
    };


    

}