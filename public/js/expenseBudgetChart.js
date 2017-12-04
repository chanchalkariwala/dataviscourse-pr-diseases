class ExpenseBudgetChart {

    constructor (movieDetails, onchange = 0, years = 0, genres = 0, allGenres, genreColors) {
    //constructor (movieDetails) {
        
        let self = this;

        this.movieDetails = movieDetails.slice();
        this.allGenres = Object.keys(allGenres).slice()
        this.genreColors = genreColors 
        
        this.movieDetailsTotal = this.movieDetails.slice();
        
        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 50, left: 50};
        let divChart = d3.select("#expenseBudgetChart #chart");

        //Gets access to the div element created for this chart from HTML
        this.svgBounds_temp = divChart.node().getBoundingClientRect();
        this.svgBounds = {'width':this.svgBounds_temp.width, 'height':800};
        
        if(onchange)
        {
            divChart.selectAll("svg").remove();
        }
        
        //add the svg to the div
        this.svg = divChart.append("svg")
            .attr("width", this.svgBounds.width)
            .attr("height", this.svgBounds.height)
            .attr("style",`background-color: #fff; 
                            background-image: 
                            linear-gradient(90deg, transparent 79px, #abced4 79px, #abced4 81px, transparent 81px),
                            linear-gradient(#eee .1em, transparent .1em);
                            background-size: 100% 1.2em;`)
                            
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        
        //Area for the second x-axis for the brush
        this.svgHeight = this.svgBounds.height - this.margin.top - this.margin.bottom;

        this.xScale = d3.scaleLinear()
            .range([this.margin.left, this.svgWidth])
        
        this.yScale = d3.scaleLinear()
            .range([this.svgHeight, this.margin.bottom])
            
        this.xAxis = d3.axisBottom().scale(this.xScale).ticks(20)
        this.yAxis = d3.axisLeft().scale(this.yScale).ticks(20)
        
        this.setupData(years, genres)
        
    };
    
    setupData(years, genres)
    {
        
        if(years == 0 && genres == 0)
        {
            this.update(onchange)
            return;
        }
        
        if(years.length == 0 || genres.length == 0)
        {
            this.movieDetails.length = 0
        }
        
        let self = this;
        
        if(years != undefined && years != null && years != 0)
        {
            this.movieDetails.length = 0
            
            for(var i = 0; i<this.movieDetailsTotal.length; i++)
            {
                if(years.includes(this.movieDetailsTotal[i].release_year))
                {
                    this.movieDetails.push(this.movieDetailsTotal[i])
                }
            }
        }
        
        var selectedMovies = [];
        
        if(genres != undefined && genres != null && genres != 0)
        {
            if(genres == 0)
            {
                if(years == 0)
                {
                    this.movieDetails = this.movieDetailsTotal.slice();
                }
                else if(years != undefined && years != null)
                {
                    this.movieDetails.length = 0
                    
                    for(var i = 0; i<this.movieDetailsTotal.length; i++)
                    {
                        if(years.includes(this.movieDetailsTotal[i].release_year))
                        {
                            this.movieDetails.push(this.movieDetailsTotal[i])
                        }
                    }
                }
            }
            else
            {
               
                let diff = this.allGenres.slice().filter(x => genres.indexOf(x) < 0 );
                
                for(var i = 0; i<this.movieDetails.length; i++)
                {
                    let union = this.movieDetails[i].genresList.filter(x => diff.indexOf(x) >= 0) 
                    
                    if(union.length == 0)
                    {
                        selectedMovies.push(this.movieDetails[i])
                    }
                }
                
                this.movieDetails = selectedMovies;
                //console.log(this.movieDetails)
            }
        }
         
        this.update();
    }

    update () {
        
        this.addAxis();
        this.addCircles();
        
    };
    
    addCircles(){
        let self = this;
        
        var tooltip_render = function(tooltip_data) {
            let text = "<div> <strong>" + tooltip_data.title + "</strong><br/>Released on " + tooltip_data.release + "<br/>" + tooltip_data.genre
            return text;
        }
        let tip = d3.tip().attr('class', 'd3-tip')
            .direction('e')
            .offset(function() {
                return [0, 0];
            })
            .html((d) => {
                
                let genres = '';
                for(let i=0; i<d.genresList.length; i++)
                {
                    genres = genres + d.genresList[i]
                    if(i != d.genresList.length - 1)
                    {
                        genres = genres + ', '
                    }
                }
                
                // populate data in the following format
                let tooltip_data = {
                    "title" : d.original_title,
                    "release": d.release_date,
                    "genre": genres
                }
                
                var html = tooltip_render(tooltip_data);
                return html;
                //return 'hello';
            });
        
        this.svg.call(tip);
        
        let circles = this.svg.selectAll('circle')
            .data(this.movieDetails)
            
        circles.exit().remove();
        
        circles = circles.enter().append('circle').merge(circles);
            
        circles
            .attr('cx', function(d){
                //console.log(self.xScale(d.budget))
                return self.xScale(d.budget);
            })
            .attr('cy', function(d){
                return self.yScale(d.revenue);
            })
            .attr('r', 5)
            .attr('fill-opacity', '0.4')
            .attr('fill', function(d, i){
                if(d.genresList.length == 1)
                {
                    return self.genreColors[d.genresList[0]]
                }
            })
            .attr('class', 'incexpCircle')
            
        circles.on('mouseover', tip.show).on('mouseout', tip.hide)
        
        let negCircles = circles.filter(function(d){
            if(d3.select(this).attr('cx') < self.xScale.range()[0])
                return true;
            
            if(d3.select(this).attr('cx') > self.xScale.range()[1])
                return true;
            
            if(d3.select(this).attr('cy') > self.yScale.range()[0])
                return true;
            
            if(d3.select(this).attr('cy') < self.yScale.range()[1])
                return true;
        })
        
        negCircles.remove();
        
        /*
        circles.select('title').remove();
        
        circles.append('title')
            .text(function(d){ return d.original_title + ', ' + d.release_date + '\n'+ d.genresList; })
        */
    };
    
    addAxis(){
        
        var self = this;
        
        this.xScale.domain([d3.min(this.movieDetails, d => d.budget), d3.max(this.movieDetails, d => d.budget)])
            
        this.yScale.domain([d3.min(this.movieDetails, d => d.revenue), d3.max(this.movieDetails, d => d.revenue)])
            
        let xAxis = this.svg.selectAll(".axis--x1")
        
        if(xAxis.empty())
        {
            xAxis = this.svg.append("g")
                .attr("class", "axis axis--x1")
                .attr("transform", "translate(" + (-3) + ", " + (this.svgHeight + 3) + ")")
                
            xAxis
                .append("text")
                .attr("x", this.svgWidth/2 - 20)
                .attr("dy","2.5em")
                .attr("fill","black")
                .attr("id","xAxisLabel")
                .attr("style","font-size:large")
                .text("Budget in Millions");
            
        }
        
        xAxis    
            .transition().duration(500)
            .call(this.xAxis)
            
               
        let yAxis = this.svg.selectAll(".axis--y")
        
        if(yAxis.empty())
        {
            yAxis = this.svg.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(" + (this.margin.left - 3) + ", +3)")
            
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
        
        }
            
        yAxis
            .transition(500)
            .call(self.yAxis)
        
        
        let brushG = this.svg.select('#expenseRevenueBrush');
        
        let brushed = function() {
            var selection = d3.event.selection;
            
            if(selection == null)
                return;
            
            //console.log(selection)
            
            self.xScale.domain([self.xScale.invert(selection[0][0]), self.xScale.invert(selection[1][0])])
            self.yScale.domain([self.yScale.invert(selection[1][1]), self.yScale.invert(selection[0][1])])
            
            xAxis    
                .transition().duration(500)
                .call(self.xAxis)
            
            yAxis    
                .transition().duration(500)
                .call(self.yAxis)
            
            self.addCircles();
            
            let clearButton = d3.select(".clear-button");
            
            if(clearButton.empty() === true) {
                clearButton = self.svg.append('text')
                    .attr("y", self.svgHeight + self.margin.bottom)
                    .attr("x", self.svgWidth - self.margin.right - self.margin.left)
                    .attr('text-anchor', 'start')
                    .attr("class", "clear-button")
                    .text("Clear Brush")
                   
                clearButton.style('cursor', 'pointer')
            }
            
            clearButton.on('click', function(){
                
                self.setupData(0, 0, 0)
                
                clearButton.remove();
            });
            
            d3.select("#expenseRevenueBrush").call(brush.move, [[0, 0], [0, 0]]);
        };
        
        if(brushG.empty())
        {
            var brush = d3.brush()
                .extent([[this.xScale.range()[0], this.yScale.range()[1]], [this.xScale.range()[1], this.yScale.range()[0]]])
                .on("end", brushed);
        
            this.svg.append("g")
                .attr("class", "brush")
                .attr("id", "expenseRevenueBrush")
                .call(brush)
        }
    };

};

