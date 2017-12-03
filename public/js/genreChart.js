class GenreChart {
    
    constructor (movieDetails, onchange = 0, years = 0, genres = 0, allGenres, genreColors) {
    //constructor (movieDetails) {
        
        var self = this;
        
        this.movieDetails = movieDetails.slice();
        this.allGenres = Object.keys(allGenres)
        this.genreColors = genreColors 
        
        this.movieDetailsTotal = this.movieDetails.slice();
        
        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 50, left: 50};
        let divChart = d3.select("#genreChordChart #chart");

        //Gets access to the div element created for this chart from HTML
        this.svgBounds_temp = divChart.node().getBoundingClientRect();
        this.svgBounds = {'width':this.svgBounds_temp.width, 'height':900};
        
        if(onchange)
        {
            divChart.selectAll("svg").remove();
        }
        
        //add the svg to the div
        this.svg = divChart.append("svg")
            .attr("width", this.svgBounds.width)
            .attr("height", this.svgBounds.height)
            
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgBounds.height - this.margin.top - this.margin.bottom;
        
        this.outerRadius = Math.min(this.svgWidth, this.svgHeight) * 0.40,
        this.innerRadius = this.outerRadius - 30;
        
        this.setupData(years, genres);
    
    };
    
    setupData(years = 0, genres = 0)
    {
        let self = this;
        
        if(years == 0 && genres == 0)
        {
            
        }
        else if(years.length == 0 || genres.length == 0)
        {
            this.movieDetails.length = 0
        }
        else
        {
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
                   
                    let diff = this.allGenres.filter(x => genres.indexOf(x) < 0 );
                    
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
        }
        
        this.genresDict = {};
        
        for(var i = 0; i<this.movieDetails.length; i++)
        {
            for(let value of this.movieDetails[i].genres)
            {
                if(self.genresDict[value['name']] == undefined)
                {
                    self.genresDict[value['name']] = 0
                }
                
                self.genresDict[value['name']] = self.genresDict[value['name']] + 1;
                
            }
        }
        
        this.genresArr = Object.keys(this.genresDict);
        this.genresMatrix = new Array();
        
        for(var i=0; i<this.genresArr.length; i++)
        {
            this.genresMatrix[i] = new Array();
            
            for(var j=0; j<this.genresArr.length; j++)
            {
                let count = 0
                if(i == j)
                {
                    let genreName = this.genresArr[i]
                    count = this.genresDict[genreName]
                }
                
                this.genresMatrix[i][j] = count;
            }
        }
        
        
        for(var i = 0; i<this.movieDetails.length; i++)
        {
            if(this.movieDetails[i].genresList.length <= 1)
                continue;

            let genresList = [];
            
            if(this.movieDetails[i].genresList.length == 2)
            {
                genresList = this.movieDetails[i].genresList;
            }
            else
            {
                let genreSubDict = {}
                for(var j = 0; j < this.movieDetails[i].genresList.length; j++)
                {
                    genreSubDict[this.movieDetails[i].genresList[j]] = this.genresDict[this.movieDetails[i].genresList[j]]
                }
                                
                var items = Object.keys(this.genresDict).map(function(key) {
                    return [key, self.genresDict[key]];
                });

                // Sort the array based on the second element
                items.sort(function(first, second) {
                    return second[1] - first[1];
                });
                
                items = items.slice(0, 2);
                
                genresList.push(items[0][0])
                genresList.push(items[1][0])
                //console.log(items)
            }
            
            let index1 = this.genresArr.indexOf(genresList[0])
            let index2 = this.genresArr.indexOf(genresList[1])
                
            this.genresMatrix[index1][index2] = this.genresMatrix[index1][index2] + 1
            this.genresMatrix[index2][index1] = this.genresMatrix[index2][index1] + 1
                
        }
        
        //console.log(this.genresMatrix)

        this.update()
        
    }
    
    update () {
        
        var self = this;
        
        var formatValue = d3.formatPrefix(",.0", 1e3);

        var chord = d3.chord()
            .padAngle(0.05)
            .sortSubgroups(d3.descending);

        var arc = d3.arc()
            .innerRadius(this.innerRadius)
            .outerRadius(this.outerRadius);

        var ribbon = d3.ribbon()
            .radius(this.innerRadius);
        
        //var color = d3.scaleOrdinal(d3.schemeCategory20c)
        var color = d3.scaleOrdinal()
                        .range(Object.keys(genreColors).map(function(key) {
                            return genreColors[key]
                        }))
                        .domain(Object.keys(genreColors));
        
        var g = this.svg.append("g")
            .attr("transform", "translate(" + this.svgWidth / 2 + "," + this.svgHeight / 2 + ")")
            .datum(chord(this.genresMatrix));
            
        var group = g.append("g")
            .attr("class", "groups")
            .selectAll("g")
                .data(function(chords) { return chords.groups; })
                .enter().append("g");
        
        group.on("mouseover", fade(0.1));
        group.on("mouseout", fade(1));
        
        function fade(opacity) {
            return function(g, i) {
                var selectedChords = self.svg.selectAll(".ribbons path")
                    .filter(function(d) { return d.source.index != i && d.target.index != i; })
                
                selectedChords.transition()
                    .style("opacity", opacity);
            };
        };

        group.append("path")
            .style("fill", function(d) { return color(self.genresArr[d.index]); })
            .style("stroke", function(d) { return d3.rgb(color(d.index)).darker(); })
            .attr("id", function(d, i) { return "group_" + d.index; })
            .attr("d", arc);
        
        group.append("text")
            .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
            .attr("dy", ".35em")
            .attr("class", "titles")
            .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
            .attr("transform", function(d) {
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                + "translate(" + (self.outerRadius + 10) + ")"
                + (d.angle > Math.PI ? "rotate(180)" : "");
            })
            .text(function(d,i) { return self.genresArr[i]; });
        
        g.append("g")
            .attr("class", "ribbons")
            .selectAll("path")
                .data(function(chords) { return chords; })
                .enter().append("path")
                    .attr("d", ribbon)
                    .style("fill", function(d) { return color(self.genresArr[d.target.index]); })
                    .style("stroke", function(d) { return d3.rgb(color(self.genresArr[d.target.index])).darker(); })
                    .on('mouseover', function(d, i){
                        d3.select(this).attr('stroke-width', '5')
                    })
                    .on('mouseout', function(d, i){
                        d3.select(this).attr('stroke-width', '1')
                    })
        
    };
    
    // Returns an array of tick angles and values for a given group and step.
    groupTicks(d, step) {
        console.log(d)
        console.log(step)
        
        var k = (d.endAngle - d.startAngle) / d.value;
            
        return d3.range(0, d.value, step).map(function(value) {
            return {value: value, angle: value * k + d.startAngle};
        });
        
        //return this.genresArr[d.index];
    };
    
};
