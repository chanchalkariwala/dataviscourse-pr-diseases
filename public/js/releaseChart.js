class ReleaseChart {

    constructor (movieDetails) {
        
        let self = this;

        this.releaseYears = new Array();
        
        this.releaseYearsDict = {};
        
        for(var i = 0; i<movieDetails.length; i++)
        {
            if(movieDetails[i].release_date == "")
            {
                continue;
            }
            
            let release_year = 0;
            let release_month = 0;
            
            //console.log(movieDetails[i].release_date.indexOf('-'))
            
            if(movieDetails[i].release_date.indexOf('-') == 2)
            {
                release_year = parseInt(movieDetails[i].release_date.substring(movieDetails[i].release_date.length - 4, movieDetails[i].release_date.length))
                
                release_month = parseInt(movieDetails[i].release_date.substring(movieDetails[i].release_date.length - 7, movieDetails[i].release_date.length - 5))
            }    
            else
            {
                release_year = parseInt(movieDetails[i].release_date.substring(0, 4))
                
                release_month = parseInt(movieDetails[i].release_date.substring(5, 7))
            }
              
            if(release_year.toString().length == 1)
            {
                console.log(movieDetails[i])
            }
              
            if(this.releaseYearsDict[release_year] == undefined)
            {
                this.releaseYearsDict[release_year] = {}
            }
            
            if(this.releaseYearsDict[release_year][release_month] == undefined)
            {
                this.releaseYearsDict[release_year][release_month] = 0
            }
            
            this.releaseYearsDict[release_year][release_month] = this.releaseYearsDict[release_year][release_month] + 1;
                
        }
        
        console.log(this.releaseYearsDict)
        
        let divChart = d3.select("#releaseChart #chart");
        
        for (var key in this.releaseYearsDict) {
            
            divChart.html(divChart.html() + 'For ' + key + '<br/>');
            
            for(var key2 in this.releaseYearsDict[key])
            {
                divChart.html(divChart.html() + key2 + ' : ' + this.releaseYearsDict[key][key2] + ', ');
            }
            
            divChart.html(divChart.html() + '<br/>')
        }
        
        
        /*
        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        let divChart = d3.select("#releaseChart #chart");

        //fetch the svg bounds
        //this.svgBounds = divyearChart.node().getBoundingClientRect();
        
        this.svgBounds = {'width':960, 'height':500};
        
        //add the svg to the div
        this.svg = divChart.append("svg")
            .attr("width", this.svgBounds.width)
            .attr("height", this.svgBounds.height)
            
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgBounds.height - this.margin.top - this.margin.bottom;
        */
    };


    update () {
    };

};
