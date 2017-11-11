class ExpenseBudgetChart {

    constructor (movieDetails) {
        
        let self = this;

        this.movieDetails = new Array();
        
        this.genres = {};
        
        for(var i = 0; i<movieDetails.length; i++)
        {
            movieDetails[i].budget = +movieDetails[i].budget;
            movieDetails[i].revenue = +movieDetails[i].revenue;
            movieDetails[i].release_year = movieDetails[i].release_date.substring(movieDetails[i].release_date.length - 4, movieDetails[i].release_date.length)
            
            movieDetails[i].genres = movieDetails[i].genres.replace(/'/g, '"');
            movieDetails[i].genres = JSON.parse(movieDetails[i].genres);
            
            movieDetails[i].release_year = parseInt(movieDetails[i].release_year);
            
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
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        let divChart = d3.select("#expenseBudgetChart #chart");

        //fetch the svg bounds
        //this.svgBounds = divyearChart.node().getBoundingClientRect();
        
        this.svgBounds = {'width':960, 'height':500};
        
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
        
        genreSelector.selectAll('option')
            .data(this.genres).enter()
            .append('option')
            .text(function (d) { 
                return d.name; 
            });
        
    };


    update (year, genre) {
        
        //console.log(this.movieDetails)
        
        if(year != undefined && year != null)
        {
            this.movieDetails.length = 0
            
            for(var i = 0; i<this.movieDetailsTotal.length; i++)
            {
                if(this.movieDetailsTotal[i].release_year == year)
                {
                    this.movieDetails.push(this.movieDetailsTotal[i])
                }
            }
        }
        
        var selectedMovies = [];
        
        if(genre != undefined && genre != null)
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
        
        
        
        let xScale = d3.scaleLinear()
            .domain([d3.min(this.movieDetails, d => d.budget), d3.max(this.movieDetails, d => d.budget)])
            .range([this.margin.left, this.svgWidth])
        
        let yScale = d3.scaleLinear()
            .domain([d3.min(this.movieDetails, d => d.revenue), d3.max(this.movieDetails, d => d.revenue)])
            .range([this.svgHeight, this.margin.bottom])
        
        let circles = this.svg.selectAll('circle')
            .data(this.movieDetails)
            
        circles.exit().remove();
        
        circles = circles.enter().append('circle').merge(circles);
            
        circles.attr('cx', function(d){
                return xScale(d.budget);
            })
            .attr('cy', function(d){
                return yScale(d.revenue);
            })
            .attr('r', 3)
            .append('title')
                .text(function(d){ return d.original_title; })
        
    };

};
