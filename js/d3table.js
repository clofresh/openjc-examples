// d3table example
//
// This example demonstrates how to:
//
//   * query ckan using the frontend ckan js client
//   * parse a csv using d3
//   * programmatically generate a simple html using d3

d3table = {}

d3table.main = function() {
  var endpoint = "https://data.openjerseycity.org",
    // You can find the dataset id by browsing the site and looking at the url of the dataset
    datasetId = "jcpd-calls-for-service",

    // Instantiate the CKAN client
    c = new CKAN.Client({endpoint: endpoint}),

    // Get the metadata for the dataset
    dataset = c.getDatasetById(datasetId, {
      success: function() {
        // Get the url to csv data
        csvUrl = dataset.toJSON().resources[0].url;

        // Download and parse the csv with D3
        d3.csv(csvUrl, d3table.processData);
      }})
}

d3table.processData = function(data) {
  // Takes an array of csv rows represented as objects
  // and turns it into an html table.
  // Pulled from here:
  // http://stackoverflow.com/questions/9268645/d3-creating-a-table-linked-to-a-csv-file

  var columns = ["Event Number", "TR", "CALLCODE",
                 "Call Code Description", "District", "Street"];

  var table = d3.select("#container").append("table"),
      thead = table.append("thead"),
      tbody = table.append("tbody");

  // append the header row
  thead.append("tr")
      .selectAll("th")
      .data(columns)
      .enter()
      .append("th")
          .text(function(column) { return column; });

  // create a row for each object in the data
  var rows = tbody.selectAll("tr")
      .data(data)
      .enter()
      .append("tr");

  // create a cell in each row for each column
  var cells = rows.selectAll("td")
      .data(function(row) {
          return columns.map(function(column) {
              return {column: column, value: row[column]};
          });
      })
      .enter()
      .append("td")
          .text(function(d) { return d.value; });
}
