class budgetRevenueYearChart {
    constructor(budgetRevenueYear, movieDetails, onchange = 0, genres = 0) {
        this.budgetRevenueYear = budgetRevenueYear;
        this.movieDetails = movieDetails;
        this.margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        };
        this.budgetRevenueYearChart = d3.select("#budgetRevenueYearChart");
        this.onchange = onchange;
        //Gets access to the div element created for this chart from HTML
        this.svgWidth = 1500;
        this.svgHeight = 550;
        this.genres = genres;
        this.loader=$("#budgetLoader");
        //creates svg element within the div
        /*this.loader=this.budgetRevenueYearChart.append("img")
        .attr("class","Loader")
        .attr("src","https://loading.io/spinners/pies/lg.pie-chart-loading-gif.gif")
        .attr("alt","Loader")
        .attr("style","width:100px; height:100px; position:absolute; left:"+this.svgWidth/2+"px; top:"+this.svgHeight/2+"px")*/

        this.svg = this.budgetRevenueYearChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
            .attr("style",`background-color: #fff; 
                            background-image: 
                            linear-gradient(90deg, transparent 79px, #abced4 79px, #abced4 81px, transparent 81px),
                            linear-gradient(#eee .1em, transparent .1em);
                            background-size: 100% 1.2em;`)
            .append("g")
            .attr("transform", "translate(120,52),scale(0.8)");
        this.svgWidth = this.svgWidth - this.margin.left - this.margin.right,
            this.svgHeight = +this.svgHeight - this.margin.top - this.margin.bottom;

    };

    update() {
        this.loader.show();



        
        if (this.onchange)
            d3.select("#budgetRevenueYearChart").select("svg").remove();
        let data = this.budgetRevenueYear;
        var tooltip_render = function(tooltip_data) {
            //let text = "<h4 class =" + tooltip_data.genre + " >Genre: " + tooltip_data.genre + " (" + parseFloat(tooltip_data.value).toFixed(2) + "%)" + "</h4>";
            let text = "<div> <strong>" + tooltip_data.type.toUpperCase() + "</strong><br/><i>Genre: " + tooltip_data.genre + "</i><br/><i>Year: " + tooltip_data.year + "</i><br/><i>Value: " + tooltip_data.value + "</i></div>"
            return text;
        }
        let tip = d3.tip().attr('class', 'd3-tip')
            .direction('e')
            .offset(function() {
                return [0, 0];
            })
            .html((d) => {
                // populate data in the following format
                let tooltip_data = {
                    "genre": $(event.target).attr("genre"),
                    "value": $(event.target).attr("value"),
                    "year": $(event.target).attr("year"),
                    "type": $(event.target).attr("type")
                }
                //pass this as an argument to the tooltip_render function then,
                //return the HTML content returned from that method.
                var html = tooltip_render(tooltip_data);
                return html;
            });
        this.svg.call(tip);

        var x = d3.scaleBand()
            .rangeRound([30, 1300]);

        var y = d3.scaleLinear().range([499, 0]); //d3.scaleLinear().rangeRound([height, 0]);

        let genreColors = {
        'TV Movie': '#ffffd9',
        'Western': '#e9f6b1',
        'War': '#d0ecb3',
        'History': '#b5e1b6',
        'Music': '#9ad6b9',
        'Foreign': '#7cccbc',
        'Animation': '#5fc0c0',
        'Fantasy': '#3fb4c4',
        'Mystery': '#35a6c2',
        'Family': '#2697c1',
        'Science Fiction': '#2089bd',
        'Adventure': '#237bb6',
        'Crime': '#236eaf',
        'Horror': '#2260a9',
        'Documentary': '#2551a2',
        'Action': '#26439b',
        'Romance': '#253594',
        'Thriller': '#1c2c80',
        'Comedy': '#12246b',
        'Drama': '#081d58'
    };
        let tempGenreColors = jQuery.extend(true, {}, genreColors);
        if (this.onchange) {
            for (let genre in tempGenreColors) {
                if (!(this.genres.includes(genre))) {
                    delete genreColors[genre];
                }

            }
        }


        var z = d3.scaleOrdinal().range(Object.keys(genreColors).map(function(key) {
            return genreColors[key]
        }));
        var keys = Object.keys(genreColors);


        //data.sort(function(a, b) { return b.total - a.total; });
        let x_domain=data[1].map(function(d) {
            return d.year;
        });
        x.domain(x_domain.sort(function(a, b) {
          return a - b;
        }));
        y.domain([0, d3.max(data[1], function(d) {
            return d.total;
        })]);
        z.domain(keys);
          this.svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + 500 + ")")
            .call(d3.axisBottom(x))
            .append("text")
            .attr("x", "685")
            .attr("dy", "3.5em")
            .attr("fill", "black")
            .attr("id", "xAxisLabel")
            .attr("style", "font-size:large")
            .text("Years");

        d3.select(".axis--x").selectAll("text:not(#xAxisLabel)").attr("transform", "rotate(-70)");
        d3.select(".axis--x").selectAll("text:not(#xAxisLabel)").attr("dy", "-0.50em");
        d3.select(".axis--x").selectAll("text:not(#xAxisLabel)").attr("x", "-20");

        let needToGetOffset=1;
        let offset=625;
        let whichGenre = -1;
        let budget_rects=this.svg.append("g")
            .selectAll("g")
            .data(d3.stack().keys(keys)(data[0]))
            .enter().append("g")
            .attr("fill", function(d) {
                return z(d.key);
            })
            .selectAll("rect")
            .data(function(d) {
                return d;
            })
            .enter().append("rect")
            .attr("x", function(d) {
                if(needToGetOffset){
                    let next_year=0;
                    if(d.data.year != x_domain[x_domain.length-1]){
                        next_year=x_domain[x_domain.indexOf(d.data.year)+1];
                        offset=((x(d.data.year)+x(next_year))/2)-(x.domain.length<24?45:40);
                    }
                    needToGetOffset=0;
                }              
                
                return (x(d.data.year)+offset);
            })
            .attr("y", function(d) {
                return y(d[1]);
            })
            .attr("stroke","white")
            .attr("width", 10)
            .attr("year", function(d) {
                return d.data.year
            })
            .attr("type", "budget")
            .attr("genre", function(d, i) {
                if (i == 0)
                    whichGenre += 1;
                return keys[whichGenre];
            })
            .attr("value", function(d) {
                return d[1]
            });

budget_rects.exit()
            .transition()
            .duration(1000)
            .remove();
budget_rects.transition()
            .duration(1000)            
            .attr("height", function(d) {
                return y(d[0]) - y(d[1]);
            });           




        whichGenre = -1;
        this.svg.append("g")
            .selectAll("g")
            .data(d3.stack().keys(keys)(data[1]))
            .enter().append("g")
            .attr("fill", function(d) {
                return z(d.key);
            })
            .selectAll("[type='revenue'] rect")
            .data(function(d) {
                return d;
            })
            .enter().append("rect")
            .attr("x", function(d) {
                return (x(d.data.year)+offset)+11;
            })
            .attr("y", function(d) {
                return y(d[1]);
            })
            .attr("stroke","white")

            .transition()
            .duration(1000)
            .attr("height", function(d) {
                return y(d[0]) - y(d[1]);
            })
            .attr("width", 10)
            .attr("year", function(d) {
                return d.data.year
            })
            .attr("genre", function(d, i) {
                if (i == 0)
                    whichGenre += 1;
                return keys[whichGenre];
            })
            .attr("type", "revenue")
            .attr("value", function(d) {
                return d[1]
            });

        this.svg.selectAll("rect").on("mouseover", tip.show)
        this.svg.selectAll("rect").on("mouseout", tip.hide);
        this.svg.selectAll("rect").on("click", function() {
            $('#fade-in').addClass('show');
            let genre = $(event.target).attr("genre"),
                value = $(event.target).attr("value"),
                year = $(event.target).attr("year"),
                type = $(event.target).attr("type");

            var filteredArray = allDataForViz["budgetRevenueYearChart"].filter(function(el) {
                return (el.year == year && JSON.parse(el.genres).map(a => a.name).includes(genre))
            });
            filteredArray = filteredArray.sort(function(a, b) {
                return b[type] - a[type]
            });
            filteredArray = filteredArray.slice(0, 5);
            let button = "<button type='button' class='close' aria-label='Close'><span aria-hidden='true'>×</span></button>";
            let p = $("<p>");

            p.text((type == "revenue" ? "The most successful " : "The most Expensive ") + genre + " movies of the year " + year + " are:");
            let ul = $("<ul/>");
            for (let row of filteredArray) {
                let li = $("<li/>");
                li.text("Title: " + row.title);
                ul.append(li);
                li = $("<li/>");
                li.text((type == "revenue" ? "Revenue: " : "Budget: ") + row[type]);
                li.attr("style", " list-style-type: none;")
                ul.append(li);
            }
            $('#fade-in').text("");
            $('#fade-in').append(button);
            $('#fade-in button').on("click", function() {
                $('#fade-in').removeClass('show');
            });
            $('#fade-in').append(p);
            $('#fade-in').append(ul);
        });

      
        let y2 = d3.scaleLinear().domain([0, d3.max(data[1], function(d) {
            return d.total;
        })]).range([500, 0]);
        this.svg.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(30," + 0 + ")")
            .call(d3.axisLeft(y2).ticks(10))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-3.8em")
            .attr("dx", "-7em")
            .attr("text-anchor", "end")
            .attr("fill", "black")
            .attr("style", "font-size:large")
            .text("Budget & Revenue in Million");

        var legend = this.svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "start")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function(d, i) {
                return "translate(-200," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", 40)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);

        legend.append("text")
            .attr("x", 70)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function(d) {
                return d;
            });
           this.loader.hide();
    }
}