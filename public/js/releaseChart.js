class ReleaseChart {

    constructor (movieDetails, onchange = 0, years = 0, genres = 0, allGenres, genreColors) {
    //constructor (movieDetails) {
        
        let self = this;
        
        this.allGenres = Object.keys(allGenres).slice()
        this.genreColors = genreColors 
        
        this.movieDetails = movieDetails;
        
        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 50, left: 50};
        let divChart = d3.select("#releaseChart #chart");

        //Gets access to the div element created for this chart from HTML
        this.svgBounds_temp = divChart.node().getBoundingClientRect();
        this.svgBounds = {'width':this.svgBounds_temp.width, 'height':700};
        
        if(onchange)
        {
            divChart.selectAll("svg").remove();
        }
        
        //add the svg to the div
        this.svg = divChart.append("svg")
            .attr("width", this.svgBounds.width)
            .attr("height", this.svgBounds.height)
            
        this.legendWidth = 150;
        
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right - this.legendWidth;
        this.svgHeight = this.svgBounds.height - this.margin.top - this.margin.bottom;
        
        this.setupData(years, genres);
    };
    
    setupData(years, genres)
    {
        this.releaseYears = new Array();
        
        this.releaseYearsDict = {};
        
        this.maxMovieCount = 0
        
        var filterGenres = false;
        let diffGenres = []
        if(genres != undefined && genres != 0)
        {
            diffGenres = this.allGenres.slice().filter(x => genres.indexOf(x) < 0 );
        }
        if(diffGenres.length != 0)
        {
            filterGenres = true;
        }
    
        for(var i = 0; i<this.movieDetails.length; i++)
        {
            if(this.movieDetails[i].release_date == "")
            {
                continue;
            }
            
            let release_year = parseInt(this.movieDetails[i].release_year)
            let release_month = parseInt(this.movieDetails[i].release_month)
            
            if(release_year < 1960)
                continue;
            
            if(this.releaseYearsDict[release_year] == undefined)
            {
                this.releaseYearsDict[release_year] = {}
                
                for(let j = 1; j<=12; j++)
                {
                    this.releaseYearsDict[release_year][j] = 0
                }
            }
            
            if(filterGenres)
            {
                let union = this.movieDetails[i].genresList.filter(x => diffGenres.indexOf(x) >= 0) 
                    
                if(union.length == 0)
                {
                    this.releaseYearsDict[release_year][release_month] = this.releaseYearsDict[release_year][release_month] + 1;
                }
            }
            else
            {
                this.releaseYearsDict[release_year][release_month] = this.releaseYearsDict[release_year][release_month] + 1;
            }
            
            if(this.maxMovieCount < this.releaseYearsDict[release_year][release_month])
            {
                this.maxMovieCount = this.releaseYearsDict[release_year][release_month]
            }
        }
        
        this.releaseYears = Object.keys(this.releaseYearsDict)
        
        if(years == 0 && years instanceof Array == false)
        {
            
        }
        else if(years.length == 0)
        {
            for(let i=0; i<this.releaseYears.length; i++)
            {
                for(let j = 1; j<=12; j++)
                {
                    this.releaseYearsDict[this.releaseYears[i]][j] = 0
                }
            }
        }
        else
        {
            for(let i=0; i<this.releaseYears.length; i++)
            {
                if(years.includes(parseInt(this.releaseYears[i])) == true)
                    continue;
                
                for(let j = 1; j<=12; j++)
                {
                    this.releaseYearsDict[this.releaseYears[i]][j] = 0
                }
            }
        }
               
        this.years = Object.keys(this.releaseYearsDict);
        let months = Object.keys(this.releaseYearsDict[this.years[0]]);
        
        this.xScale = d3.scaleBand()
                        .domain(this.years)
                        .range([this.margin.left, this.svgWidth])
        
        this.yScale = d3.scaleBand()
                        .domain(months)
                        .range([this.margin.bottom, this.svgHeight])
        
        this.xAxis = d3.axisBottom().scale(this.xScale).ticks(this.years.length)
        this.yAxis = d3.axisLeft().scale(this.yScale).ticks(12)
        
        
        this.update();
    }
    
    update () {
        
        
        let self = this;
        
        this.colorScale = d3.scaleLinear()
            .domain([0, self.maxMovieCount])
            .range(["#ffffff", "#ff0000"]);
        
        this.addAxis();
        this.addLegend();
        
        let rectangleWidth = (this.svgWidth - this.margin.left)/this.years.length;
        let rectangleHeight = (this.svgHeight - this.margin.bottom)/12;
        
        let yearGroup = this.svg.selectAll('.monthG')
                            .data(this.years)
                            
        yearGroup = yearGroup.enter().append('g').merge(yearGroup);
        
        yearGroup.exit().remove();
        
        yearGroup.attr('class', 'monthG')
            .attr('transform', function(d, i){
                return "translate(" + (self.margin.left + rectangleWidth * i) + ", 0)"
            })
            .attr('year', function(d){ return d; })
            
        let monthRects = yearGroup.selectAll('rect')
                            .data(function(d){ 
                                //console.log(d)
                                //console.log(self.releaseYearsDict[d])
                                
                                let monthArray = new Array();
                                for(let i=1; i<=12; i++)
                                {
                                    monthArray.push('' + i + ':' + self.releaseYearsDict[d][i])
                                }
                                //console.log(monthArray)
                                
                                return monthArray
                            })
                        
        monthRects = monthRects.enter().append('rect').merge(monthRects)
        
        monthRects.exit().remove();
        
        monthRects
            .attr('x', '0')
            .attr('y', function(d, i){
                return self.margin.bottom + rectangleHeight * i;
            })
            .attr('stroke-width', '1')
            .attr('fill', 'white')
            .attr('stroke', 'black')
            .attr('width', rectangleWidth)
            .attr('height', rectangleHeight)
            .attr('month', function(d){
                return d;
            })
            .attr('fill', function(d){
                let index = d.indexOf(':');
                let movieCount = parseInt(d.substring(index+1));
                return self.colorScale(movieCount)
            })
            .attr('stroke', '#eee')
            .attr('stroke-width', '1')
    };
    
    addAxis(){
    
        let xAxis = this.svg.selectAll(".axis--x")
        
        if(xAxis.empty() == false)
        {
            xAxis.remove();
        }
        
        xAxis = this.svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate( 0, " + (this.svgHeight + 1) + ")")
    
        xAxis
            .append("text")
            .attr("x", this.svgWidth/2 - 20)
            .attr("dy","2.5em")
            .attr("fill","black")
            .attr("id","xAxisLabel")
            .attr("style","font-size:large")
            .text("Years");
        
        xAxis    
            .transition().duration(500)
            .call(this.xAxis)
        
        xAxis.selectAll('.tick > text')
            .attr("transform", "rotate(-90)")
            .attr("dy","-0.50em")
            .attr('x', '-20')
            
        let yAxis = this.svg.selectAll(".axis--y")
        
        if(yAxis.empty() == false)
        {
            yAxis.remove();
        }
            
        yAxis = this.svg.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(" + (this.margin.left - 1) + ", 0)")
        
        yAxis
            .transition(500)
            .call(d3.axisLeft().scale(this.yScale).ticks(15))
        
        yAxis
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-2em")  
            .attr("dx","-10em")  
            .attr("text-anchor", "end")
            .attr("fill","black")
            .attr("style","font-size:large")
            .text("Months");
    };
    
    addLegend(){
        
        var self = this;
        
        let breakSize = this.maxMovieCount/15;
        let boxes = new Array();
        
        for(let i=0; i<12; i++)
        {
            let start = i*breakSize;
            let end = start + breakSize;
            
            let list = []
            list[0] = Math.ceil(start);
            list[1] = Math.floor(end);
            
            boxes.push(list);
            
        }
        
        var legend = this.svg.append("g")
            .attr('id', 'releaseChartLegend')
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
            .attr("text-anchor", "start")
            .selectAll("g")
            .data(boxes.slice().reverse())
            .enter().append("g")
            .attr("transform", function(d, i) {
                return "translate("+ self.svgWidth +"," + (self.margin.bottom + (i * (self.svgHeight - self.margin.bottom)/12)) + ")";
            });

        legend.append("rect")
            .attr("x", 40)
            .attr("width", 19)
            .attr("height", (self.svgHeight - self.margin.bottom)/12)
            .attr("fill", function(d, i){
                return self.colorScale(d[0])
            });

        legend.append("text")
            .attr("x", 70)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function(d) {
                return d;
            });
    }
    
};
