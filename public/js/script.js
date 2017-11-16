
d3.csv("data/expensebudget.csv", function(d) {
    
    d.budget = +d.budget/1000000;
    d.revenue = +d.revenue/100000000;
    d.genres = d.genres.replace(/'/g, '"');
    d.genres = JSON.parse(d.genres);
            
    let release_year = 0;
    let release_month = 0;
    
    if(d.release_date.indexOf('-') == 2)
    {
        release_year = parseInt(d.release_date.substring(d.release_date.length - 4, d.release_date.length))
        release_month = parseInt(d.release_date.substring(d.release_date.length - 7, d.release_date.length - 5))
    }    
    else
    {
        release_year = parseInt(d.release_date.substring(0, 4))
        release_month = parseInt(d.release_date.substring(5, 7))
    }
    
    d.release_year = release_year
    d.release_month = release_month
    
    return d;
    
}, function (error, expenseDetails) {
    
    let expenseBudgetChart = new ExpenseBudgetChart(expenseDetails);
    expenseBudgetChart.update();
    
    let releaseChart = new ReleaseChart(expenseDetails);
    
});


d3.csv("public/data/budgetRevenueYearChartMovieDetails.csv", function(d) {
  d.budget = +d.budget;
  d.revenue = +d.revenue;
  d.year = +d.year;
  return d;
}, function(error, movieDetails) {
    let budRev=""
  if (error) throw error;
      d3.csv("public/data/budgetRevenueYearChart.csv", function(d) {
      d.budget = +d.budget;
      d.revenue = +d.revenue;
      d.year = +d.year;
      return d;
    }, function(error, budgetRevenue) {
      if (error) throw error;
        budRev=budgetRevenue;
        let budRevYearChart = new budgetRevenueYearChart(budRev,movieDetails);
        budRevYearChart.update();
    });

         
});
