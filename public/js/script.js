var allDataForViz = {};

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

allDataForViz['genreColors'] = genreColors
allDataForViz["allGenres"] = {}

d3.csv("data/expensebudget.csv", function(d) {

    d.budget = +d.budget / 1000000;
    d.revenue = +d.revenue / 100000000;
    d.genres = d.genres.replace(/'/g, '"');
    d.genres = JSON.parse(d.genres);
    
    d.genresList = [];
    for(var i=0; i<d.genres.length; i++)
    {
        d.genresList.push(d.genres[i].name)
    }
    
    let release_year = 0;
    let release_month = 0;

    if (d.release_date.indexOf('-') == 2) {
        release_year = parseInt(d.release_date.substring(d.release_date.length - 4, d.release_date.length))
        release_month = parseInt(d.release_date.substring(d.release_date.length - 7, d.release_date.length - 5))
    } else {
        release_year = parseInt(d.release_date.substring(0, 4))
        release_month = parseInt(d.release_date.substring(5, 7))
    }

    d.release_year = release_year
    d.release_month = release_month

    return d;

}, function(error, movieDetails) {
    allDataForViz["movieDetails"] = movieDetails;
    
    let expenseBudgetChart = new ExpenseBudgetChart(movieDetails, 0, 0, 0, allGenres = allDataForViz["allGenres"], genreColors = allDataForViz['genreColors']);
    
    let releaseChart = new ReleaseChart(movieDetails, 0, 0, 0, allGenres = allDataForViz["allGenres"],  genreColors = allDataForViz['genreColors']);
    
    let genreChart = new GenreChart(movieDetails, 0, 0, 0, allGenres = allDataForViz["allGenres"], genreColors = allDataForViz['genreColors']);
});

function updateBudgetRevenue(type, ul) {
    let genres = [],
        yearsWithDecades = [];
    if (type == "genre") {
      if (!ul == "")
          ul.find('li').each(function() {
            genres.push(this.innerHTML.trim());
        });
        $('#chosenYears li').each(function() {
            yearsWithDecades.push(this.innerHTML.replace(/Decade/g, "").trim());
        })

    } else {
        if (!ul == "")
            ul.find('li').each(function() {
                yearsWithDecades.push(this.innerHTML.replace(/Decade/g, "").trim())
            })
        $('#chosenGenres li').each(function() {
            genres.push(this.innerHTML.trim())
        });

    }
    var years = [];
    for (let year of yearsWithDecades) {
        if (year.includes('-')) {
            for (let first = +(year.split("-")[0])+1; first <= year.split("-")[1]; first++) {
                years.push(+first);
            }
        } else {
            years.push(year);
        }
    }
        //drawbars(finalFormattedData);

    

    let dictOfDictAndKeywords = getDictOfDict(allDataForViz["budgetRevenueYearChart"], 1, years, genres);
    let dictOfDict=dictOfDictAndKeywords[0];
    let finalFormattedData = getFinalFormattedDataForBudgetRevenue(dictOfDict);

    let budRevYearChart = new budgetRevenueYearChart(finalFormattedData, allDataForViz["budgetRevenueYearChart"], 1, genres);
    budRevYearChart.update();
    let keywords=dictOfDictAndKeywords[1]; 
    let wordCloudChart = new wordCloud(keywords,1);
    wordCloudChart.update(); 

    let expenseBudgetChart = new ExpenseBudgetChart(allDataForViz["movieDetails"], 1, years, genres, allGenres = allDataForViz["allGenres"], genreColors = allDataForViz['genreColors']);
    
    let releaseChart = new ReleaseChart(allDataForViz["movieDetails"], 1, years, genres, allGenres = allDataForViz["allGenres"], genreColors = allDataForViz['genreColors']);
    
    let genreChart = new GenreChart(allDataForViz["movieDetails"], 1, years, genres, allGenres = allDataForViz["allGenres"], genreColors = allDataForViz['genreColors']);
}

function defineOnclickEventsForYearsDropdown() {
    $('.multiselect-group').attr("state", "collapsed");
    $('.multiselect-native-select').find('li[class="active"]').css("display", "none");
    $('.caret-container').on("click", function() {
        if ($(this.parentElement.parentElement).attr("state") == "uncollapsed") {
            $(this.firstElementChild).css("transform", "rotate(360deg)");
            $(this.parentElement.parentElement).attr("state", "collapsed");
        } else {
            $(this.firstElementChild).css("transform", "rotate(180deg)");
            $(this.parentElement.parentElement).attr("state", "uncollapsed");
        }
    });
    $('.multiselect-all').on('click', function(e) {
        if (e.target.type == "checkbox") {
            if (e.target.checked) {
                $('.multiselect-group input').not(":checked").trigger('click');
                e.stopPropagation();
            } else {
                $('.multiselect-group input').trigger('click');
                e.stopPropagation();
            }
        }

    });

    $('#menu-bar').find('input').not("[type='text']").on("click", function(e) {
        if (e.originalEvent.isTrusted) {
            let status = e.target.checked;
            //Case 1: Clciked on Select All
            if (e.target.value == "multiselect-all") {
                if (status) {
                    $("#chosenYears").text("");
                    $("#chosenYears").append("<strong>Selected Years:<strong>");
                    let ul = $('<ul />');
                    $("#year-dropdown").find("optgroup").each(function() {
                        let li = $('<li />').text($(this).attr('label'));
                        ul.append(li);
                        //console.log($(this).attr('label'));
                    });
                    $("#chosenYears").append(ul);
                    updateBudgetRevenue("year", ul);
                } else {

                    $("#chosenYears").text("");
                    $("#chosenYears").append("<strong>Selected Years:<strong><br/>-");
                    updateBudgetRevenue("year", "");
                    //console.log('-');
                }
            }
            //Case 2: Clicked on OptGroup or option
            else {

                let unselectedOptgroup = "";
                if (e.target.value.startsWith('Decade') && !status)
                    unselectedOptgroup = e.target.value;
                if (!(e.target.value.startsWith('Decade'))) {
                    let option = $("option[value='" + e.target.value + "']");
                    option[0].selected = status;
                    //All options of optgroup have been selected
                    if (option[0].parentElement.childElementCount == $(option[0].parentElement).find(":selected").length)
                        $("input[value^='" + option[0].parentElement.getAttribute("value") + "']")[0].checked = true;
                    if (option[0].parentElement.childElementCount != $(option[0].parentElement).find(":selected").length)
                        $("input[value^='" + option[0].parentElement.getAttribute("value") + "']")[0].checked = false;
                }

                $("#chosenYears").text("");
                $("#chosenYears").append("<strong>Selected Years:<strong>");
                let ul = $('<ul />');
                $('input[value^="Decade"]:checked').each(function() {
                    let li = $('<li />').text(this.value);
                    ul.append(li);
                    //console.log(this.value);
                })
                $('input[value^="Decade"]').not(':checked').each(function() {
                    if (this.value != unselectedOptgroup) {
                        let optgroup = $("optgroup[value='" + this.value + "']");
                        var options = optgroup.children("option").filter(":selected").each(function() {
                            let li = $('<li />').text($(this).attr('value'));
                            ul.append(li);
                            //console.log($(this).attr('value'));
                        });
                    }
                })
                $("#chosenYears").append(ul);
                updateBudgetRevenue("year", ul);
            }
        }
    });
}

function populateYearDropdown(years) {
    //var years = [1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017];
    var select = $("#year-dropdown");
    let optgroup = $("<optgroup />").attr({
              "value": "Decade " + (years[0] - (years[0] % 10)) + "-" + (years[0] - (years[0] % 10) + 10),
              "label": "Decade " + (years[0] - (years[0] % 10)) + "-" + (years[0] - (years[0] % 10) + 10)
          });
    let lower_limit=years[0] - (years[0] % 10),upper_limit=years[0] - (years[0] % 10)+10;
    $.each(years, function() {
            if (!(this >=lower_limit && this<=upper_limit)) {
          optgroup = $("<optgroup />").attr({
                "value": "Decade " + (this - (this % 10)) + "-" + (this - (this % 10) + 10),
                "label": "Decade " + (this - (this % 10)) + "-" + (this - (this % 10) + 10)
            });
          lower_limit=this - (this % 10);
          upper_limit=this - (this % 10)+10;
                }
        
        optgroup.append($("<option />").val(this).text(this));
        select.append(optgroup);  

    });

   // $("#button_budgetRevenueYearChart").trigger('click');
    $('#year-dropdown').multiselect({
        enableClickableOptGroups: true,
        enableCollapsibleOptGroups: true,
        includeSelectAllOption: true,
        enableFiltering: true,
        enableCaseInsensitiveFiltering: false,
        //allSelectedText: 'All Selected'
    });

    $("#year-dropdown").multiselect('selectAll', false);
    $("#year-dropdown").multiselect('updateButtonText');
    //$('#menu-bar .multiselect-native-select').css('float',"right");
    //$('#menu-bar .multiselect-selected-text').text('Select Years')
    //$("#year-dropdown").multiselect('selectAll', false);
    //$("#year-dropdown").multiselect('updateButtonText');

    setTimeout(function() {
        defineOnclickEventsForYearsDropdown();
        $("#chosenYears").text("");
        $("#chosenYears").append("<strong>Selected Years:<strong>");
        let ul = $('<ul />');
        $("#year-dropdown").find("optgroup").each(function() {
            let li = $('<li />').text($(this).attr('label'));
            ul.append(li);
        });
        $("#chosenYears").append(ul);
    }, 1000);
}

function drawGenreBars(genres) {
    let svg = d3.select('#genre-bar')
        .attr("width", "100%" )
        .attr("height", 50)
        .append("g")
        .attr("transform", "translate(10,10),scale(0.76)");
    var tooltip_render = function(tooltip_data) {
        let text = "<h4 class =" + tooltip_data.genre + " >" + tooltip_data.genre + " (" + parseFloat(tooltip_data.value).toFixed(2) + "%)" + "</h4>";
        return text;
    }
    let tip = d3.tip().attr('class', 'd3-tip')
        .direction('se')
        .offset(function() {
            return [0, 0];
        })
        .html((d) => {
            // populate data in the following format
            let tooltip_data = {
                "genre": d[0],
                "value": d[1]
            }
            //pass this as an argument to the tooltip_render function then,
            //return the HTML content returned from that method.
            var html = tooltip_render(tooltip_data);
            return html;
        });
    svg.call(tip);
    var genres = Object.keys(genres).map(function(key) {
        return [key, genres[key]];
    });

    // Sort the array based on the first element
    genres.sort(function(first, second) {
        return first[1] - second[1];
    });
    
    //let genreColors={'Action':'#0000ff', 'Adventure':' #006600', 'Fantasy':'#ffff00', 'Science Fiction':'#e600e6', 'Crime':'#7094db', 'Drama':'#ffb3d1', 'Thriller':'#00ffff', 'Animation':'#00ff00', 'Family':'#ccffcc', 'Western':'#cccccc', 'Comedy':'#66ffcc', 'Romance':'#ff0000', 'Horror':'#000000', 'Mystery':'#ffb3b3', 'History':'#e6b800', 'War':'#d24dff', 'Music':'#660066', 'Documentary':'#000066', 'Foreign':'#ccffff', 'TV Movie':'#ffffcc'};


    let rectangles = svg.selectAll("rect").data(genres);
    let rectEnter = rectangles.enter()
        .append("rect");

    rectangles = rectEnter.merge(rectangles);
    var cumulative = [];
    let i = 0;
    for (let item of genres) {
        if (i == 0) {
            cumulative[0] = item[1];
            i = 1;
        } else {
            cumulative[i] = cumulative[i - 1] + item[1];
            i++;
        }
    }
    cumulative.pop();
    rectangles.transition()
        .duration(1000)
        .attr("height", 30)
        .attr("x", function(d, i) {
            return i == 0 ? 20 : cumulative[i - 1] * 13 + 20;
        })
        .attr("y", 5)
        .attr("fill", function(d) {
            return genreColors[d[0]]
        })
        .attr("stroke", "pink")
        .attr("stroke-width", "2")
        .attr("clicked", "yes")
        .attr("genre", function(d) {
            return d[0]
        })
        .attr("width", function(d) {
            return d[1]+"%";
        })
        .attr("color", function(d, i) {
            return genreColors[d[0]]
        });
    rectangles.on("click", function() {
        if (this.getAttribute("clicked") == "no") {
            //this.setAttribute("fill",this.getAttribute('color'));
            $(this).css("fill-opacity", 1);
            // $(this).css("stroke-width", 2);
            this.setAttribute("clicked", "yes");
        } else {
            $(this).css("fill-opacity", 0);
            //$(this).css("stroke-width", 0);
            this.setAttribute("clicked", "no");
        }

        $("#chosenGenres").text("");
        $("#chosenGenres").append("<strong>Selected Genres:<strong>");
        let ul = $('<ul />');
        $("[clicked='yes']").each(function() {
            let li = $('<li />').text(this.getAttribute("genre"));
            ul.append(li);
        })
        $("#chosenGenres").append(ul);
        updateBudgetRevenue("genre", ul);
    })
    rectangles.on("mouseover", tip.show);
    rectangles.on("mouseout", tip.hide);
    /*rectangles.append("title")
              .text(function(d){
               return d[0];
              });*/
    setTimeout(function() {
        $("#chosenGenres").text("");
        $("#chosenGenres").append("<strong>Selected Genres:<strong>");
        ul = $('<ul />');
        $("[clicked='yes']").each(function() {
            let li = $('<li />').text(this.getAttribute("genre"));
            ul.append(li);
        })
        $("#chosenGenres").append(ul);
    }, 1000);


}

function getDictOfDict(movieDetails, onchange = 0, selectedYears = 0, selectedGenres = 0) {
    
    let primaryDict = {},
        genres = {},
        totalGenres = 0,
        years = [],
        keywords={},
        totalKeywords=0;
    //i = 0
    for (let row of movieDetails) {
       // console.log(i++);
        if (onchange) {
            let containsBadGenre = 0;
            for (let item of JSON.parse(row.genres)) {
                if (!(selectedGenres.includes(item.name))) {
                    containsBadGenre = 1;
                    break;
                }
            }
            if (!(selectedYears.includes(row.year)) || containsBadGenre) {
                continue;
            }

        }
        if(row.genres=="[]")
          continue;
        if (!(years.includes(row.year)) && row.year > 1000)
            years.push(row.year);
        for (let item of JSON.parse(row.genres)) {
            if (item.name in genres) {
                genres[item.name] += 1;
            } else {
                genres[item.name] = 1;
            }
            totalGenres++;
        }
        for (let item of JSON.parse(row.keywords)) {
            if (item in keywords) {
                keywords[item] += 1;
            } else {
                keywords[item] = 1;
            }
            totalKeywords++;
        }
        if (row.budget > 100 && row.revenue>100){ //&& row.year >= 1960) {
            if (row["year"] in primaryDict) {
                for (let item of JSON.parse(row.genres)) {
                    if (item.name in primaryDict[row.year]["budget"]) {
                        primaryDict[row.year]["budget"][item.name] += +row.budget / (1000000 * JSON.parse(row.genres).length);
                        primaryDict[row.year]["runtime"][item.name] += +row.runtime>0?+row.runtime:0;
                        
                        primaryDict[row.year]["revenue"][item.name] += +row.revenue / (1000000 * JSON.parse(row.genres).length);
                    } else {
                        primaryDict[row.year]["budget"][item.name] = +row.budget / (1000000 * JSON.parse(row.genres).length);
                        primaryDict[row.year]["revenue"][item.name] = +row.revenue / (1000000 * JSON.parse(row.genres).length);
                        primaryDict[row.year]["runtime"][item.name] = +row.runtime>0?+row.runtime:0;
                        
                    }
                }
                primaryDict[row.year]["totalBudget"] += +row.budget / 1000000;
                primaryDict[row.year]["totalRevenue"] += +row.revenue / 1000000;
                primaryDict[row.year]["totalRuntime"] += +row.runtime>0?+row.runtime:0;
                primaryDict[row.year]["totalNumberOfMovies"] += 1;
            } else {
                let yearNotPresent = 1;
                for (let item of JSON.parse(row.genres)) {
                    if (yearNotPresent) {
                        let temp1 = {},
                            temp2 = {},
                            temp3 = {},
                            temp4 = {};
                        temp1[item.name] = row.budget / (1000000 * JSON.parse(row.genres).length);
                        temp3["budget"] = temp1;
                        temp2[item.name] = row.revenue / (1000000 * JSON.parse(row.genres).length);
                        temp3["revenue"] = temp2;
                        temp4[item.name] = +row.runtime>0?+row.runtime:0;
                        
                        temp3["runtime"] = temp4;
                        primaryDict[row.year] = temp3;
                        yearNotPresent = 0;
                    } else {
                        primaryDict[row.year]["budget"][item.name] = +row.budget / 1000000;
                        primaryDict[row.year]["revenue"][item.name] = +row.revenue / 1000000;
                        primaryDict[row.year]["runtime"][item.name] = +row.runtime>0?+row.runtime:0;
                        
                    }
                }
                primaryDict[row.year]["totalBudget"] = +row.budget / 1000000;
                primaryDict[row.year]["totalRevenue"] = +row.revenue / 1000000;
                primaryDict[row.year]["totalRuntime"] = +row.runtime>0?+row.runtime:0;
                primaryDict[row.year]["totalNumberOfMovies"] = 1;
            }
        }
    }

    if (!onchange) {
        for (let item in genres) {
            genres[item] = (genres[item] / totalGenres) * 100;
        }
        
        allDataForViz["allGenres"] = genres    
            
        drawGenreBars(genres);
        allDataForViz["genres"]=genres;
        populateYearDropdown(years.sort(function(a, b) {
          return a - b;
        }));
       
    }

    return [primaryDict,keywords];
}

function getFinalFormattedDataForBudgetRevenue(dictOfDict) {
    let total = [];
    let data = [],
        data2 = [],
        data3 = {};
        data4={};   
        totalMovies=0;
    let genres = ['TV Movie', 'Foreign', 'Western', 'Documentary', 'War', 'Music', 'History', 'Animation', 'Mystery', 'Fantasy', 'Family', 'Horror', 'Science Fiction', 'Crime', 'Adventure', 'Romance', 'Action', 'Thriller', 'Comedy', 'Drama'];
    for (let item in dictOfDict) {
        let temp = {},
            temp2 = {};
        temp["year"] = item, temp2["year"] = item;
        temp["total"] = dictOfDict[item].totalBudget;
        temp2["total"] = dictOfDict[item].totalRevenue;
        totalMovies+=dictOfDict[item].totalNumberOfMovies;
        data3[item] = dictOfDict[item].totalRuntime/dictOfDict[item].totalNumberOfMovies;
        //temp["total"] = 0;
        //temp2["total"] = 0;
        for (let genre of genres) {
            temp[genre] = (genre in dictOfDict[item].budget) ? dictOfDict[item].budget[genre] : 0;
            temp2[genre] = (genre in dictOfDict[item].revenue) ? dictOfDict[item].revenue[genre] : 0;
            if(genre in data4){
                
                data4[genre] += (genre in dictOfDict[item].runtime) ? +dictOfDict[item].runtime[genre] : 0;
            }                
            else{
                
                data4[genre] = (genre in dictOfDict[item].runtime) ? +dictOfDict[item].runtime[genre] : 0;
            }
                
            //temp["total"] += temp[genre];
            //temp2["total"] += temp2[genre];
        }
        data.push(temp);
        data2.push(temp2);
    }
    for(let genre in data4){
        data4[genre]/=(allDataForViz["genres"][genre]*totalMovies/100);
        }
    total.push(data);
    total.push(data2);
    total.push(data3);
    total.push(data4);
    return total;
}

d3.csv("public/data/budgetRevenueYearChart.csv", function(d) {
    d.budget = +d.budget;
    d.revenue = +d.revenue;
    //if(d.release_date.includes('-')){
     // d.release_date=d.release_date.split('-')[2]+'/'+d.release_date.split('-')[1]+'/'+d.release_date.split('-')[0]
      //console.log(i,d.release_date);
    //}
    
    d.year = +d.release_date.split('/')[2];
    return d;
}, function(error, movieDetails) {
    if (error)
        throw error;
    allDataForViz["budgetRevenueYearChart"] = movieDetails;
    //let budRev = getBudgetRevenueConsolidatedDataAndGenresForMenu(movieDetails);
    let dictOfDictAndKeywords = getDictOfDict(movieDetails);
    let dictOfDict=dictOfDictAndKeywords[0]
    let finalFormattedData = [];
    let temp=getFinalFormattedDataForBudgetRevenue(dictOfDict);
    finalFormattedData.push(temp[0]);
    finalFormattedData.push(temp[1]);
    let keywords=dictOfDictAndKeywords[1]; 
    let wordCloudChart = new wordCloud(keywords);
    wordCloudChart.update(); 
    let yearRuntime=temp[2];
    let genreRuntime=temp[2];
    //drawbars(finalFormattedData);

    let budRevYearChart = new budgetRevenueYearChart(finalFormattedData, movieDetails);
    budRevYearChart.update();
});
/*
function openViz(vizName) {
    var i;
    var x = document.getElementsByClassName("viz");
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none"; 
       $("[id^='button']").css("color","black");
    }
    document.getElementById(vizName).style.display = "block";  
    document.getElementById("button_"+vizName).style.color = "pink";  
}*/
