
d3.csv("data/expensebudget.csv", function (error, expenseDetails) {
    let expenseBudgetChart = new ExpenseBudgetChart(expenseDetails);
    expenseBudgetChart.update();
    
    let releaseChart = new ReleaseChart(expenseDetails);
    
});