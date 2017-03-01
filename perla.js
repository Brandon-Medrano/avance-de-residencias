    
    var numberFormat = d3.format(".2f");
    var usChart = dc.geoChoroplethChart("#us-chart");
    var industryChart = dc.bubbleChart("#industry-chart");
    var roundChart = dc.bubbleChart("#round-chart");
    var chart = dc.pieChart("#test");
    var chart2 = dc.pieChart("#test2");
    var chart3 = dc.barChart('#test3');
    var goodYesNoPieChart = dc.pieChart('#dc-coreAcc-piechart');
    var table = dc.dataTable('#table');

    //=========== bd=========================
    d3.json("php/data3.php", function (data) {
    var data = crossfilter(data);

    // ===================tabla =============
        yearDim  = data.dimension(function(d) {return +d.sbm;}),          
    spendPerYear = yearDim.group().reduceSum(function(d) {return +d.sbm;}),
    spendDim = data.dimension(function(d) {return Math.floor(d.idmapa/10);}),
    spendHist    = spendDim.group().reduceCount();
    nameDim  = data.dimension(function(d) {return d.edo;}),
    spendPerName = nameDim.group().reduceSum(function(d) {return +d.sbm;}),
    // =================== fin tabla =============
 
  // ========pie ejcernum  ======================
     runDimension  = data.dimension(function(d) {return ""+d.edoabre;})
     var  g = runDimension.group().reduceSum(function(d) {return d.ejcernum;});
  // ======== fin pie ejcernum  ======================
 
  // ========pie ejcernum y comucernum ======================
     runDimension2  = data.dimension(function(d) {return ""+d.edoabre;})     
      var  gi = runDimension2.group().reduceSum(function(d) {return  (parseFloat(d.ejcernum)+ parseFloat(d.comucernum))});
  // ======== fin pie ejcernum y comucernum ======================
 
 //========== burbujas ===========================
        var industries = data.dimension(function (d) {
            return d["IndustryGroup"];
        });
     
        var rounds = data.dimension(function (d) {
            return d["RoundClassDescr"];
        }); 
 //=============== fin de burbujas ======================

//================ mapa ===============================
       var states = data.dimension(function (d) {
            return d["edoabre"];
        });
         var staterangoporcSum = states.group().reduceSum(function (d) {
          return d["rangoporc"];
        });
//================  fin mapa ===============================

//===================== grafica barras================
         fruitDimension = data.dimension(function(d) {return d.edoabre;}),
          sumGroup = fruitDimension.group().reduceSum(function(d) {return d.narnum;});
//=====================fin grafica barras================

 //========== burbujas ================
        var statsByIndustries = industries.group().reduce(
                function (p, v) {
                    p.amountrangoporc += +v["rangoporc"];
                    p.narnum += +v["narnum"];
                    return p;
                },
                function (p, v) {
                    p.amountrangoporc -= +v["rangoporc"];
                    if (p.amountrangoporc < 0.001) p.amountrangoporc = 0; // do some clean up
                    p.narnum -= +v["narnum"];
                    return p;
                },
                function () {
                    return {amountrangoporc: 0, narnum: 0}
                }
        );
        var statsByRounds = rounds.group().reduce(
                 function (p, v) {
                    p.amountrangoporc += +v["rangoporc"];
                    p.narnum += +v["narnum"];
                    return p;
                },
                function (p, v) {
                    p.amountrangoporc -= +v["rangoporc"];
                    if (p.amountrangoporc < 0.001) p.amountrangoporc = 0; // do some clean up
                    p.narnum -= +v["narnum"];
                    return p;
                },
                function () {
                    return {amountrangoporc: 0, narnum: 0}
                }
        );
 //========== fin  burbujas ================

//========== mapa ================
        d3.json("../geo/mx-states.json", function (statesJson) {
            usChart.width(990)
                    .height(380)
                    .dimension(states)
                    .group(staterangoporcSum)
                    .colors(d3.scale.quantize().range([ "#f4d03f","#d1f2eb","#a3e4d7","#f39c12","#48c9b0","#1abc9c","#17a589","#148f77","#117864","#0e6251"]))
                    .colorDomain([32, 190])
                    .colorCalculator(function (d) { return d ? usChart.colors()(d) : '#ccc'; })
                    .overlayGeoJson(statesJson.features, "state", function (d) {
                        return d.properties.name;
                    })
                    .title(function (d) {
                   return "Estado: " + d.key + "\nAvance de certificación : " + numberFormat(d.value ? d.value : 0) + "%";
                });        
     
//==========  fin mapa ================           

      //================ pie  ejcernum =============            
                     chart
                     .width(668)
                     .height(280)
                     .slicesCap(32)
                     .radius(120)
                     .dimension(runDimension)
                     .group(g)
                     .legend(dc.legend())
                     .on('pretransition', function(chart) {
                     chart.selectAll('text.pie-slice').text(function(d) {
                     return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
                     })
                    });
                    
      //================ fin  pie ejcernum =============
    
    //================ pie  ejcernum y comucernum =============                           
                  chart2
                     .width(668)
                     .height(280)
                     .slicesCap(32)
                     .radius(120)
                     .dimension(runDimension2)
                     .group(gi)
                     .legend(dc.legend())
                     .on('pretransition', function(chart) {
                     chart.selectAll('text.pie-slice').text(function(d) {
                     return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
                     })
                    });
    //================ fin pie  ejcernum y comucernum =============





















/*
                    function coreCount_from_threshold() {
                    var scoreThreshold=document.getElementById('slideRange').value;
                    scoreThreshold=parseFloat(scoreThreshold);
                    if (isNaN(scoreThreshold)) {
                    scoreThreshold=0.5
                    }
                    return data.dimension(function (d) {
                    var maxNumber=32;
                    if (d.sbh >maxNumber*scoreThreshold) {
                    return 'sbh';
                   } else {
                    return 'sbm';
                  }
                  });
                  }
                  var coreCount = coreCount_from_threshold();
                  var coreCountGroup = coreCount.group();


//================ pie 2 columnas=====
    function updateSlider(slideValue) {
        var sliderDiv = document.getElementById("sliderValue");
        sliderDiv.innerHTML = slideValue;
        coreCount.dispose();
        coreCount = coreCount_from_threshold();
        coreCountGroup = coreCount.group();
        goodYesNoPieChart
            .dimension(coreCount)
            .group(coreCountGroup);
    }

            goodYesNoPieChart
            .width(320)
            .height(320)
            .radius(120)
            .innerRadius(40)
            .dimension(coreCount)
            .title(function(d){return d.value;})
            .group(coreCountGroup)
            .label(function (d) {
            if (goodYesNoPieChart.hasFilter() && !goodYesNoPieChart.hasFilter(d.key)) {
                return d.key + '(0%)';
            }
             var label = d.key;
             if (all.value()) {
             label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
             }
             return label;
              })
  
//================ fin pie 2 columnas=====
*/
   //=============== barras ======================
                     chart3
                     .width(968)
                     .height(380)
                     .x(d3.scale.ordinal())
                     .xUnits(dc.units.ordinal)
                     .brushOn(false)
                     .xAxisLabel('Estados')
                     .yAxisLabel('Escala')
                     .dimension(fruitDimension)
                     .barPadding(0.1)
                     .outerPadding(0.05)
                     .group(sumGroup);

   //=============== fin  barras ======================

//==================== tabla ====================
                       var allDollars = data.groupAll().reduceSum(function(d) { return +d.sbm; });
                       table
                       .dimension(spendDim)
                       .group(function(d) {
                        return d.value;
                       })
                       .showGroups(false)
                       .columns(['name',
                       {
                       label: 'sbm',
                        format: function(d) {
                       return '$' + d.sbm;
                       }
                       },
                      'edoabre',
                       {
                       label: 'Percent of Total',
                      format: function(d) {
                      return Math.floor((d.sbm / allDollars.value()) * 100) + '%';
                      }
                     }]);

  
//==================== fin  tabla ====================                   
              
              //====== descarga==========================
d3.select('#download')
    .on('click', function() {
        var data = nameDim.top(Infinity);
        if(d3.select('#download-type input:checked').node().value==='table') {
            data = data.map(function(d) {
                var row = {};
                table.columns().forEach(function(c) {
                    row[table._doColumnHeaderFormat(c)] = table._doColumnValueFormat(c, d);
                });
                return row;
            });
        }
        var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});
        saveAs(blob, 'data.csv');
    });
              //====== fin de  descarga==========================

//====================== burbujas======================
            industryChart.width(990)
                    .height(200)
                    .margins({top: 10, right: 50, bottom: 30, left: 60})
                    .dimension(industries)
                    .group(statsByIndustries)
                    .colors(d3.scale.category10())
                    .keyAccessor(function (p) {             // .keyAccessor- El Xvalor se pasa a la .x()escala para determinar la ubicación de píxeles
                        return p.value.amountrangoporc;
                    })
                    .valueAccessor(function (p) {
                        return p.value.narnum;
                    })
                    .radiusValueAccessor(function (p) {
                        return p.value.amountrangoporc;
                    })
                    .x(d3.scale.linear().domain([0, 500]))
                    .r(d3.scale.linear().domain([0, 400]))
                    .minRadiusWithLabel(15)
                    .elasticY(true)
                    .yAxisPadding(100)         // .yAxisPaddingy .xAxisPaddingagregar relleno a los datos por encima y por debajo de sus valores máximos en los mismos dominios de unidades como los descriptores de acceso.
                    .elasticX(true)           // .elasticYy .elasticXdeterminar si el gráfico debe cambiar la escala de cada eje para ajustar los datos.
                    .xAxisPadding(200)
                    .maxBubbleRelativeSize(0.07)
                    .renderHorizontalGridLines(true)
                    .renderVerticalGridLines(true)
                    .renderLabel(true)
                    .renderTitle(true)
                    .title(function (p) {          //Las etiquetas se muestran en la tabla para cada burbuja. Los títulos que aparecen al pasar el ratón. ( Opcional ) si la carta debe hacer etiquetas,default = true


                        return p.key
                                + "\n"
                                + "Cantidad ->Porcentaje: " + numberFormat(p.value.amountrangoporc) + "%\n"
                                + "Numero  ->Núcleos Agrarios: " + numberFormat(p.value.narnum);
                    });
            industryChart.yAxis().tickFormat(function (s) {    // Establecer un formato de señal de encargo. Tanto .yAxis()y .xAxis()devolver un objeto eje, por lo que cualquier encadenamiento método adicional se aplica al eje, no el gráfico.


                 return s + " narnum";
            });
            industryChart.xAxis().tickFormat(function (s) {
                return s + "";
            });
            roundChart.width(990)
                    .height(200)
                    .margins({top: 10, right: 50, bottom: 30, left: 60})
                    .dimension(rounds)
                    .group(statsByRounds)
                    .colors(d3.scale.category10())
                    .keyAccessor(function (p) {
                        return p.value.amountrangoporc;
                    })
                    .valueAccessor(function (p) {
                        return p.value.narnum;
                    })
                    .radiusValueAccessor(function (p) {
                        return p.value.amountrangoporc;
                    })
                    .x(d3.scale.linear().domain([0, 500]))
                    .r(d3.scale.linear().domain([0, 900]))
                    .minRadiusWithLabel(15)
                    .elasticY(true)
                    .yAxisPadding(150)
                    .elasticX(true)
                    .xAxisPadding(300)
                    .maxBubbleRelativeSize(0.07)
                    .renderHorizontalGridLines(true)
                    .renderVerticalGridLines(true)
                    .renderLabel(true)
                    .renderTitle(true)
                    .title(function (p) {
                        return p.key
                                + "\n"
                                + "cantidad2 -> rangoporc: " + numberFormat(p.value.amountrangoporc) + "M\n"
                                + "Numero2  ->narnum: " + numberFormat(p.value.narnum);
                    });
            roundChart.yAxis().tickFormat(function (s) {
                return s + " narnum";
            });
            roundChart.xAxis().tickFormat(function (s) {
                return s + "M";
            });

            dc.renderAll();
        });
    });

//====================== fin burbujas======================