class ExpenseBudgetChart {

    constructor (movieDetails) {
        
        let self = this;

        this.movieDetails = new Array();
        
        this.genres = {};
        
        for(var i = 0; i<movieDetails.length; i++)
        {
            if(movieDetails[i].budget != 0 && movieDetails[i].revenue != 0)
            {
                this.movieDetails.push(movieDetails[i])
                
                for(let value of movieDetails[i].genres)
                {
                    self.genres[value['id']] = value
                }
            }
        }
        
        var arr = [];

        for (var key in this.genres) {
            if (this.genres.hasOwnProperty(key)) {
                arr.push( this.genres[key] );
            }
        }
        this.genres = arr;
        
        this.movieDetailsTotal = this.movieDetails.slice();
        
        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 50, left: 50};
        let divChart = d3.select("#expenseBudgetChart #chart");

        //Gets access to the div element created for this chart from HTML
        this.svgBounds_temp = divChart.node().getBoundingClientRect();
        this.svgBounds = {'width':this.svgBounds_temp.width, 'height':500};
        
        //add the svg to the div
        this.svg = divChart.append("svg")
            .attr("width", this.svgBounds.width)
            .attr("height", this.svgBounds.height)
            
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgBounds.height - this.margin.top - this.margin.bottom;

        let yearSelector = d3.select('#divYearSelector').append('select').attr('id', 'yearSelector');
        
        yearSelector.on('change', function(){
            let YearValue = d3.select('#yearSelector').property('value')
            let genreValue = d3.select('#genreSelector').property('value')
            self.update(YearValue, genreValue);
        })
        
        let years = d3.map(this.movieDetails, function(d){return d.release_year;}).keys()
        years.sort();

        yearSelector.append('option').text('Overall').attr('value', 'overall')
        
        yearSelector.selectAll('option')
            .data(years).enter()
            .append('option')
            .text(function (d) { 
                return d; 
            });
        
        
        let genreSelector = d3.select('#divGenreSelector').append('select').attr('id', 'genreSelector');
        
        genreSelector.on('change', function(){
            let YearValue = d3.select('#yearSelector').property('value')
            let genreValue = d3.select('#genreSelector').property('value')
            self.update(YearValue, genreValue);
        })
        
        genreSelector.append('option').text('Overall').attr('value', 'overall')
        
        genreSelector.selectAll('option')
            .data(this.genres).enter()
            .append('option')
            .text(function (d) { 
                return d.name; 
            });
        
        this.xScale = d3.scaleLinear()
            .range([this.margin.left, this.svgWidth])
        
        this.yScale = d3.scaleLinear()
            .range([this.svgHeight, this.margin.bottom])
            
        this.xAxis = d3.axisBottom().scale(this.xScale).ticks(20)
        this.yAxis = d3.axisLeft().scale(this.yScale).ticks(20)
        
    };


    update (year, genre) {
        
        //console.log(this.movieDetails)
        let self = this;
        
        if(year != undefined && year != null)
        {
            if(year == 'overall')
            {
                this.movieDetails = this.movieDetailsTotal.slice();
            }
            else
            {
                year = parseInt(year)
            
                this.movieDetails.length = 0
                
                for(var i = 0; i<this.movieDetailsTotal.length; i++)
                {
                    if(this.movieDetailsTotal[i].release_year == year)
                    {
                        this.movieDetails.push(this.movieDetailsTotal[i])
                    }
                }
            }
        }
        
        var selectedMovies = [];
        
        if(genre != undefined && genre != null)
        {
            if(genre == 'overall')
            {
                if(year == 'overall')
                {
                    this.movieDetails = this.movieDetailsTotal.slice();
                }
                else if(year != undefined && year != null)
                {
                    year = parseInt(year)
            
                    this.movieDetails.length = 0
                    
                    for(var i = 0; i<this.movieDetailsTotal.length; i++)
                    {
                        if(this.movieDetailsTotal[i].release_year == year)
                        {
                            this.movieDetails.push(this.movieDetailsTotal[i])
                        }
                    }
                }
            }
            else
            {
                for(var i = 0; i<this.movieDetails.length; i++)
                {
                    for(var j=0; j<this.movieDetails[i].genres.length; j++)
                    {
                        if(this.movieDetails[i].genres[j].name == genre)
                        {
                            selectedMovies.push(this.movieDetails[i])
                            break;
                        }
                    }
                }
                
                this.movieDetails = selectedMovies;
                console.log(this.movieDetails)
            }
        }
        
        this.xScale.domain([d3.min(this.movieDetails, d => d.budget), d3.max(this.movieDetails, d => d.budget)])
            
        this.yScale.domain([d3.min(this.movieDetails, d => d.revenue), d3.max(this.movieDetails, d => d.revenue)])
            
        let xAxis = this.svg.selectAll(".axis--x")
        
        if(xAxis.empty() == false)
        {
            xAxis.remove();
        }
        
        xAxis = this.svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(" + (-3) + ", " + (this.svgHeight + 3) + ")")
            //.attr("transform", "translate(" + this.margin.left + ", " + (this.svgHeight + this.margin.bottom) + ")")
    
        xAxis
            .append("text")
            .attr("x", this.svgWidth/2 - 20)
            .attr("dy","2.5em")
            .attr("fill","black")
            .attr("id","xAxisLabel")
            .attr("style","font-size:large")
            .text("Budget in Millions");
        
        xAxis    
            .transition().duration(500)
            .call(this.xAxis)
               
        let yAxis = this.svg.selectAll(".axis--y")
        
        if(yAxis.empty() == false)
        {
            yAxis.remove();
        }
            
        yAxis = this.svg.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(" + (this.margin.left - 3) + ", +3)")
        
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
            .text("Revenue in Billions");
            
        let circles = this.svg.selectAll('circle')
            .data(this.movieDetails)
            
        circles.exit().remove();
        
        circles = circles.enter().append('circle').merge(circles);
            
        circles.attr('cx', function(d){
                return self.xScale(d.budget);
            })
            .attr('cy', function(d){
                return self.yScale(d.revenue);
            })
            .attr('r', 3)
            
        circles.on('mouseover', function(d){
                d3.select(this).attr('fill', 'blue')
            }).on('mouseout', function(d){
                d3.select(this).attr('fill', 'black')
            })
        
        circles.select('title').remove();
        
        circles.append('title')
            .text(function(d){ return d.original_title + ', ' + d.release_date; })
        
    };

};
