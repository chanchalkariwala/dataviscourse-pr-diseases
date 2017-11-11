
d3.csv("data/expensebudget.csv", function (error, expenseDetails) {
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