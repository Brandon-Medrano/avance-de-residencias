
d3.json('php/data3.php', function (data) {

        var gainOrLoss = vc.dimension(function (d) {
        return d.sbh & d.sbm ? 'Hombres' : 'Mujeres';
    });
    // Produce counts records in the dimension
    var gainOrLossGroup = gainOrLoss.group();

 gainOrLossChart /* dc.pieChart('#gain-loss-chart', 'chartGroup') */
    // (_optional_) define chart width, `default = 200`
        .width(180)
    // (optional) define chart height, `default = 200`
        .height(180)
    // Define pie radius
        .radius(80)
    // Set dimension
        .dimension(gainOrLoss)
    // Set group
        .group(gainOrLossGroup)
    // (_optional_) by default pie chart will use `group.key` as its label but you can overwrite it with a closure.
        .label(function (d) {
            if (gainOrLossChart.hasFilter() && !gainOrLossChart.hasFilter(d.key)) {
                return d.key + '(0%)';
            }
            var label = d.key;
            if (all.value()) {
                label += '(' + (d.value / all.value() * 100) + '%)';
            }
            return label;
        });


